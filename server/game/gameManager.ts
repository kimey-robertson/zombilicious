import { Server, Socket } from "socket.io";
import { Game, Lobby, Player, PlayerCards, Zone } from "../../shared/types";
import {
  checkWinCondition,
  getNextPlayer,
  getPlayerNameBySocketId,
  rollDice,
  sendGameLogEvent,
  stopPlayerDisconnectTimer,
} from "./gameUtils";
import { tutorialMap } from "../maps/maps";
import { GameNotFoundError, OperationFailedError } from "../utils/socketErrors";
import {
  calculateMovableZones,
  calculateRangedAttackZones,
  checkIfBuildingHasBeenAccessed,
  getZoneFromId,
  performZombieAction,
  spawnZombies,
} from "../maps/mapUtils";
import { cards } from "../cards";
import { getRandomCard } from "../utils/helpers";

export const games: Game[] = [];

// All function in this file should return Game or throw an error
// There should be no emits in this file

function createGame(lobby: Lobby, io: Server): Game {
  if (games.find((game) => game.id === lobby.id)) {
    throw new OperationFailedError("Create game", {
      message: `Game already exists with id ${lobby.id}`,
    });
  }
  if (!lobby) {
    throw new OperationFailedError("Create game", {
      message: `No lobby provided`,
    });
  }

  const chosenMap = structuredClone(tutorialMap); // Will be dynamic in the future

  const game: Game = {
    id: lobby.id,
    name: lobby.gameName,
    players: lobby.players.map((player) => ({
      id: player.id,
      name: player.name,
      myTurn: player.isHost,
      totalActions: 3,
      actionsRemaining: 3,
      XP: 0,
      playerCards: {
        inReserve: [null, null, null],
        inHand: [cards[2], null],
        swappableCard: null,
      },
      currentZoneId: chosenMap.startingZone,
      movableZones: calculateMovableZones(chosenMap, chosenMap.startingZone),
      searchedThisTurn: false,
      totalHealth: 2,
      currentHealth: 2,
      alive: true,
      canMoveThisTurn: true,
    })),
    status: "active",
    disconnectedPlayers: {},
    gameLogs: [],
    map: chosenMap,
    isZombiesTurn: false,
  };

  // Join all players from the lobby to the game
  lobby.players.forEach((player) => {
    const playerSocket = io.sockets.sockets.get(player.id);
    if (!playerSocket) {
      throw new OperationFailedError("Create game", {
        message: `Player socket not found with id ${player.id}`,
      });
    } else {
      playerSocket.join(game.id);
      console.log(`Player ${player.name} joined game ${game.id}`);
    }
  });

  games.push(game);

  game.players.forEach((player) => {
    sendGameLogEvent(io, game.id, {
      id: (game.gameLogs.length + 1).toString(),
      timestamp: new Date(),
      type: "system",
      message: `Player ${player.name} has joined the game`,
      icon: "💪",
    });
  });

  return game;
}

function deleteGame(gameId: string): Game {
  if (!gameId) throw new OperationFailedError("Delete game");

  const game = games.find((game) => game.id === gameId);
  if (!game) throw new GameNotFoundError(gameId);

  // Remove the game from the games array
  games.splice(games.indexOf(game), 1);
  return game;
}

function getGameBySocketId(socketId: string): Game {
  if (!socketId) throw new OperationFailedError("Get game by socket id");
  const game = games.find((game) =>
    game.players.some((player) => player.id === socketId)
  );
  if (!game) throw new GameNotFoundError(socketId, "in getGameBySocketId");
  return game;
}

function getGameById(gameId: string): Game {
  if (!gameId) throw new OperationFailedError("Get game by id");
  const game = games.find((game) => game.id === gameId);
  if (!game) throw new GameNotFoundError(gameId, "in getGameById");
  return game;
}

function removePlayerFromGame(
  gameId: string,
  targetPlayerId: string,
  io: Server,
  reason: string = "left"
): Game {
  if (!gameId || !targetPlayerId || !io)
    throw new OperationFailedError("Remove player from game");

  // Get the target player name
  const targetPlayerName = getPlayerNameBySocketId(targetPlayerId);

  // Get the game
  let game = getGameById(gameId);

  // If the target player is the current player, update the turn
  if (game.players.find((player) => player.myTurn)?.id === targetPlayerId) {
    game = endTurn(gameId, io);
  }

  // Stop the disconnect timer for this player
  stopPlayerDisconnectTimer(gameId, targetPlayerId);

  // Remove the player from the game
  delete game.disconnectedPlayers[targetPlayerId];
  game.players = game.players.filter((player) => player.id !== targetPlayerId);

  // Need to sort this
  // Check if the game is empty
  //   if (game?.players.length === 0) {
  //     game = deleteGame(gameId);
  //   }

  // Set the game status to active
  game.status = "active";

  const reasonMessage =
    reason === "vote-kick"
      ? `has been voted to be kicked from game`
      : reason === "chose-to-leave"
      ? `has chosen to abandon you..`
      : reason === "dead"
      ? `has died and left the game`
      : `has left the game`;

  // Send the game log event
  sendGameLogEvent(io, game.id, {
    id: (game.gameLogs.length + 1).toString(),
    timestamp: new Date(),
    type: "system",
    message: `Player ${targetPlayerName} ${reasonMessage}`,
    icon: reason === "vote-kick" ? "🚫" : "👋",
  });

  return game;
}

function rejoinGame(
  gameId: string,
  playerIdFromLocalStorage: string,
  newPlayerId: string,
  playerSocket: Socket | undefined,
  io: Server
): Game {
  if (!gameId || !playerIdFromLocalStorage || !newPlayerId || !io) {
    throw new OperationFailedError("Rejoin game");
  }
  const game = getGameById(gameId);

  // Check if player is actually disconnected from this game
  if (!game.disconnectedPlayers[playerIdFromLocalStorage]) {
    throw new OperationFailedError("Rejoin game", {
      message: `Player ${playerIdFromLocalStorage} is not disconnected from game ${gameId}`,
    });
  }

  // Stop the disconnect timer for this player
  stopPlayerDisconnectTimer(gameId, playerIdFromLocalStorage);

  // Remove player from disconnected players
  delete game.disconnectedPlayers[playerIdFromLocalStorage];

  // Join the player's socket to the game room
  if (!playerSocket) {
    throw new OperationFailedError("Rejoin game", {
      message: `Player socket not found with id ${newPlayerId}`,
    });
  } else {
    playerSocket.join(gameId);
    console.log(
      `Player ${newPlayerId} with previous id ${playerIdFromLocalStorage} rejoined game ${gameId}`
    );
  }

  // Switch the player's id with the new player's id
  const playerIndex = game.players.findIndex(
    (player) => player.id === playerIdFromLocalStorage
  );
  if (playerIndex !== -1) {
    game.players[playerIndex].id = newPlayerId;
  }

  sendGameLogEvent(io, game.id, {
    id: (game.gameLogs.length + 1).toString(),
    timestamp: new Date(),
    type: "system",
    message: `Player ${getPlayerNameBySocketId(
      newPlayerId
    )} reconnected to game`,
    icon: "❤️",
  });

  // If no more disconnected players, set game status to active
  if (Object.keys(game.disconnectedPlayers).length === 0) {
    game.status = "active";
  }

  return game;
}

function updatePlayerTurn(game: Game, nextPlayer: Player, io: Server): Game {
  if (!nextPlayer) {
    throw new OperationFailedError("Update player turn", {
      message: `No next player provided`,
    });
  }

  nextPlayer.myTurn = true;
  sendGameLogEvent(io, game.id, {
    id: (game.gameLogs.length + 1).toString(),
    timestamp: new Date(),
    type: "system",
    message: `It's now player ${nextPlayer.name}'s turn`,
    icon: "🔥",
  });
  return game;
}

function voteKickPlayerFromGame(
  gameId: string,
  targetPlayerId: string,
  votingPlayerId: string,
  io: Server
): Game {
  let game = getGameById(gameId);
  game.disconnectedPlayers[targetPlayerId]?.kickVotes?.push(votingPlayerId);

  if (
    game.disconnectedPlayers[targetPlayerId]?.kickVotes?.length ===
    game.players?.length - 1
  ) {
    game = removePlayerFromGame(gameId, targetPlayerId, io, "vote-kick");
    game.status = "active";
  }

  return game;
}

function movePlayerToZone(
  gameId: string,
  playerId: string,
  fromZoneId: string,
  toZoneId: string,
  io: Server
): Game {
  const game = getGameById(gameId);
  const player = game.players.find((player) => player.id === playerId);
  if (!player) {
    throw new OperationFailedError("Move player to zone", {
      message: `Player not found in game ${gameId} with id ${playerId}`,
    });
  }

  if (!player.canMoveThisTurn) {
    throw new OperationFailedError("Move player to zone", {
      message: `Player ${player.name} cannot move this turn`,
    });
  }

  // Check if the zone is a valid zone
  const zone = game.map.zones.find((zone) => zone.id === toZoneId);
  if (!zone) {
    throw new OperationFailedError("Move player to zone", {
      message: `Zone ${toZoneId} not found in game ${gameId}`,
    });
  }

  // Check if the zone is a movable zone
  const movableZone = player.movableZones.find((zone) => zone.id === toZoneId);
  if (!movableZone) {
    throw new OperationFailedError("Move player to zone", {
      message: `Zone ${toZoneId} is not a movable zone`,
    });
  }

  // Check if the player is in the from zone
  const currentPlayer = game.players.find((player) => player.id === playerId);
  if (!currentPlayer || currentPlayer.currentZoneId !== fromZoneId) {
    throw new OperationFailedError("Move player to zone", {
      message: `Player ${playerId} is not in zone ${fromZoneId}`,
    });
  }

  // Update the player's current zone
  currentPlayer.currentZoneId = toZoneId;

  if (getZoneFromId(toZoneId, game.map).zombies > 0) {
    player.canMoveThisTurn = false;
  }

  // Update the player's movable zones
  player.movableZones = calculateMovableZones(game.map, toZoneId);

  const zombiesInZone = getZoneFromId(fromZoneId, game.map).zombies;

  // Update the player's actions remaining
  player.actionsRemaining -= 1 + zombiesInZone;

  // Send a log event
  sendGameLogEvent(io, gameId, {
    id: (game.gameLogs.length + 1).toString(),
    timestamp: new Date(),
    type: "movement",
    message: `Player ${player.name} moved from zone ${fromZoneId} to zone ${toZoneId}`,
    icon: "🚶",
  });

  return game;
}

function endTurn(gameId: string, io: Server): Game {
  let game = getGameById(gameId);
  const playerIndex = game.players.findIndex((player) => player.myTurn);

  if (playerIndex !== -1) {
    game.players[playerIndex].myTurn = false;
  }

  const nextPlayer = getNextPlayer(game, playerIndex);

  if (nextPlayer) {
    game = updatePlayerTurn(game, nextPlayer, io);
  } else {
    game = startZombiesTurn(gameId, io);
  }
  return game;
}

function startZombiesTurn(gameId: string, io: Server): Game {
  let game = getGameById(gameId);
  if (game.players.some((player) => player.myTurn)) {
    throw new OperationFailedError("Start zombies turn", {
      message: `Some players are still in their turn`,
    });
  }

  game.isZombiesTurn = true;

  sendGameLogEvent(io, gameId, {
    id: (game.gameLogs.length + 1).toString(),
    timestamp: new Date(),
    type: "system",
    message: `It's now the zombies turn!`,
    icon: "🧟",
  });

  // Create a snapshot of zones with their zombie counts at the start of the turn
  const zombieSnapshot = game.map.zones
    .filter((zone) => zone.zombies > 0)
    .map((zone) => ({ zoneId: zone.id, zombieCount: zone.zombies }));

  // Delay the zombie movement message by 2 seconds
  setTimeout(() => {
    // Re-fetch the game to ensure it still exists
    game = games.find((g) => g.id === gameId) as Game;
    if (!game) {
      console.log(
        `[startZombiesTurn] Game ${gameId} no longer exists, cancelling zombie turn`
      );
      return;
    }

    sendGameLogEvent(io, gameId, {
      id: (game.gameLogs.length + 1).toString(),
      timestamp: new Date(),
      type: "system",
      message: `Zombies are now attacking & moving...`,
      icon: "🧟",
    });

    // Move zombies immediately after the message
    for (const snapshot of zombieSnapshot) {
      if (game.status === "lost") break;

      // Find the current zone object
      const currentZone = game.map.zones.find((z) => z.id === snapshot.zoneId);
      if (!currentZone || currentZone.zombies === 0) continue;

      // Temporarily set the zone's zombie count to the original count for this turn
      const originalZombieCount = currentZone.zombies;
      currentZone.zombies = Math.min(snapshot.zombieCount, originalZombieCount);

      const result = performZombieAction(
        currentZone,
        game.map,
        game.players,
        game.status
      );

      // Calculate how many zombies actually moved/died and adjust the zone count accordingly
      const zombiesAfterAction = currentZone.zombies;
      const zombiesThatMoved = snapshot.zombieCount - zombiesAfterAction;

      // Restore the correct count: original count minus the ones that moved from this zone's original population
      currentZone.zombies = originalZombieCount - zombiesThatMoved;

      if (result.messages) {
        result.messages.forEach((message) => {
          sendGameLogEvent(io, gameId, {
            id: (game.gameLogs.length + 1).toString(),
            timestamp: new Date(),
            type: "system",
            message,
            icon: "🧟",
          });
        });
      }

      if (result.isGameLost) {
        game.status = "lost";
        deleteGame(gameId);
        break;
      }
    }

    // Early return if the game is lost
    if (game.status === "lost") {
      io.to(gameId).emit("game-updated", game);
      return;
    }

    // Emit game update after zombie movement
    io.to(gameId).emit("game-updated", game);

    // Delay zombie spawning by another 2 seconds
    setTimeout(() => {
      // Re-fetch the game again to ensure it still exists
      game = games.find((g) => g.id === gameId) as Game;
      if (!game) {
        console.log(
          `[startZombiesTurn] Game ${gameId} no longer exists, cancelling zombie spawning`
        );
        return;
      }

      // Check if any zones have a zombie spawn token
      const zonesWithSpawnToken = game.map.zones.filter(
        (zone) => zone.hasZombieSpawn
      );
      if (zonesWithSpawnToken.length > 0) {
        zonesWithSpawnToken.forEach((zone) => {
          const zombiesToAdd = spawnZombies(zone);
          if (zombiesToAdd > 0) {
            sendGameLogEvent(io, gameId, {
              id: (game.gameLogs.length + 1).toString(),
              timestamp: new Date(),
              type: "system",
              message: `${zombiesToAdd} zombie${
                zombiesToAdd > 1 ? "s" : ""
              } spawned in zone ${zone.id}`,
              icon: "🧟",
            });
          } else {
            sendGameLogEvent(io, gameId, {
              id: (game.gameLogs.length + 1).toString(),
              timestamp: new Date(),
              type: "system",
              message: `No zombies spawned in zone ${zone.id}. Lucky you!`,
              icon: "🧟",
            });
          }
        });
      }

      // Final game update after spawning
      io.to(gameId).emit("game-updated", game);

      // End zombie turn and start next player turn
      game.isZombiesTurn = false;
      const nextPlayer = getNextPlayer(game, 0, true);
      if (nextPlayer) {
        nextPlayer.myTurn = true;
      }
      game.map.zones.forEach((zone) => (zone.noiseTokens = 0));
      game.players.forEach((player) => {
        player.actionsRemaining = player.totalActions;
        player.searchedThisTurn = false;
        player.canMoveThisTurn = true;
      });

      sendGameLogEvent(io, game.id, {
        id: (game.gameLogs.length + 1).toString(),
        timestamp: new Date(),
        type: "system",
        message: `It's now player ${nextPlayer?.name}'s turn`,
        icon: "🔥",
      });

      io.to(gameId).emit("game-updated", game);
    }, 2000);
  }, 2000);

  return game;
}

function openDoor(gameId: string, playerId: string, doorId: string): Game {
  let game = getGameById(gameId);

  const player = game.players.find((player) => player.id === playerId);
  if (!player) {
    throw new OperationFailedError("Open door", {
      message: `Player not found in game ${gameId} with id ${playerId}`,
    });
  }

  const door = game.map.doors.find((door) => door.id === doorId);
  if (!door) {
    throw new OperationFailedError("Open door", {
      message: `Door not found in game ${gameId} with id ${doorId}`,
    });
  }

  const playerCurrentZoneId = game.players.find(
    (player) => player.id === playerId
  )?.currentZoneId;
  if (!door.zoneIds.some((zoneId) => zoneId === playerCurrentZoneId)) {
    throw new OperationFailedError("Open door", {
      message: `Player is not in the same zone as the door ${doorId}`,
    });
  }

  if (
    !player.playerCards?.inHand.some(
      (card) => card?.canOpenDoorsWithoutNoise || card?.canOpenDoorsWithNoise
    )
  ) {
    throw new OperationFailedError("Open door", {
      message: `Player does not have a card that can open doors`,
    });
  }

  if (door.state === "open") {
    throw new OperationFailedError("Open door", {
      message: `Door is already open`,
    });
  }

  // If the player has a card that can open doors with noise, but not without noise, generate noise
  if (
    player.playerCards?.inHand.some((card) => card?.canOpenDoorsWithNoise) &&
    !player.playerCards?.inHand.some((card) => card?.canOpenDoorsWithoutNoise)
  ) {
    game = generateNoise(gameId, player.currentZoneId);
  }

  door.state = "open";
  player.actionsRemaining -= 1;
  game.players.forEach((player) => {
    player.movableZones = calculateMovableZones(game.map, player.currentZoneId);
  });

  checkIfBuildingHasBeenAccessed(game.map, playerCurrentZoneId, door);

  return game;
}

function generateNoise(
  gameId: string,
  zoneId: string,
  playerId?: string,
  asAction: boolean = false
): Game {
  const game = getGameById(gameId);
  const zone = game.map.zones.find((zone) => zone.id === zoneId);
  if (!zone) {
    throw new OperationFailedError("Generate noise", {
      message: `Zone not found in game ${gameId} with id ${zoneId}`,
    });
  }
  zone.noiseTokens += 1;

  if (asAction && playerId) {
    const player = game.players.find((player) => player.id === playerId);
    if (!player) {
      throw new OperationFailedError("Generate noise", {
        message: `Player not found in game ${gameId} with id ${playerId}`,
      });
    }
    player.actionsRemaining -= 1;
  }

  return game;
}

function organiseInventory(
  gameId: string,
  playerId: string,
  playerCards: PlayerCards,
  asAction: boolean = false
): Game {
  const game = getGameById(gameId);
  const player = game.players.find((player) => player.id === playerId);
  if (!player) {
    throw new OperationFailedError("Organise inventory", {
      message: `Player not found in game ${gameId} with id ${playerId}`,
    });
  }
  player.playerCards = playerCards;
  if (asAction) {
    player.actionsRemaining -= 1;
  }
  console.log("organiseInventory", playerCards);

  return game;
}

function searchForItems(
  gameId: string,
  zoneId: string,
  playerId: string,
  io: Server
): Game {
  const game = getGameById(gameId);
  const zone = game.map.zones.find((zone) => zone.id === zoneId);
  const player = game.players.find((player) => player.id === playerId);

  if (!player) {
    throw new OperationFailedError("Search for items", {
      message: `Player not found in game ${gameId} with id ${playerId}`,
    });
  }
  if (!zone) {
    throw new OperationFailedError("Search for items", {
      message: `Zone not found in game ${gameId} with id ${zoneId}`,
    });
  }
  if (!zone.room) {
    throw new OperationFailedError("Search for items", {
      message: `Zone ${zoneId} is not a room`,
    });
  }
  if (player.searchedThisTurn) {
    throw new OperationFailedError("Search for items", {
      message: `Player has already searched this turn`,
    });
  }

  if (zone.zombies > 0) {
    throw new OperationFailedError("Search for items", {
      message: `You can't search in a zone with zombies`,
    });
  }
  const card = getRandomCard();

  player.playerCards.swappableCard = card;
  player.searchedThisTurn = true;
  player.actionsRemaining -= 1;

  // Send a log event
  sendGameLogEvent(io, game.id, {
    id: (game.gameLogs.length + 1).toString(),
    timestamp: new Date(),
    type: "system",
    message: `Player ${getPlayerNameBySocketId(playerId)} found a ${
      card?.name
    } in zone ${zoneId}`,
    icon: "🎁",
  });

  return game;
}

function discardSwappableCard(
  gameId: string,
  playerId: string,
  updatedPlayerCards: PlayerCards,
  io: Server
): Game {
  const game = getGameById(gameId);
  const player = game.players.find((player) => player.id === playerId);
  if (!player) {
    throw new OperationFailedError("Discard swappable card", {
      message: `Player not found in game ${gameId} with id ${playerId}`,
    });
  }
  if (!updatedPlayerCards.swappableCard) {
    throw new OperationFailedError("Discard swappable card", {
      message: `Player does not have a swappable card`,
    });
  }
  const swappableCard = updatedPlayerCards.swappableCard;
  updatedPlayerCards.swappableCard = null;
  player.playerCards = updatedPlayerCards;
  player.actionsRemaining -= 1;

  // Send a log event
  sendGameLogEvent(io, game.id, {
    id: (game.gameLogs.length + 1).toString(),
    timestamp: new Date(),
    type: "system",
    message: `Player ${getPlayerNameBySocketId(playerId)} discarded their ${
      swappableCard?.name
    } card`,
    icon: "🗑️",
  });

  return game;
}

function attackZombies(
  gameId: string,
  playerId: string,
  cardId: string,
  zoneId: string,
  io: Server,
  type: "melee" | "ranged"
): Game {
  let game = getGameById(gameId);
  const player = game.players.find((player) => player.id === playerId);
  if (!player) {
    throw new OperationFailedError("Attack zombies", {
      message: `Player not found in game ${gameId} with id ${playerId}`,
    });
  }
  const card = player.playerCards.inHand.find((card) => card?.id === cardId);
  if (!card) {
    throw new OperationFailedError("Attack zombies", {
      message: `Player does not have a card with id ${cardId}`,
    });
  }
  if (card.maxRange !== 0 && type === "melee") {
    throw new OperationFailedError("Attack zombies", {
      message: `Card ${cardId} is not a melee attack`,
    });
  }
  if (card.maxRange === 0 && type === "ranged") {
    throw new OperationFailedError("Attack zombies", {
      message: `Card ${cardId} is not a ranged attack`,
    });
  }
  const zone = game.map.zones.find((zone) => zone.id === zoneId);
  if (!zone) {
    throw new OperationFailedError("Attack zombies", {
      message: `Zone not found in game ${gameId} with id ${zoneId}`,
    });
  }
  if (zone.zombies === 0) {
    throw new OperationFailedError("Attack zombies", {
      message: `Zone ${zoneId} has no zombies`,
    });
  }
  const { possibleZombiesKilled, diceResults } = rollDice(card);
  let actualZombiesKilled = 0;
  if (possibleZombiesKilled > zone.zombies) {
    actualZombiesKilled = zone.zombies;
    zone.zombies = 0;
  } else {
    actualZombiesKilled = possibleZombiesKilled;
    zone.zombies -= possibleZombiesKilled;
  }
  player.actionsRemaining -= 1;
  player.XP += actualZombiesKilled;

  if (card.createsNoiseWhenAttacking) {
    game = generateNoise(gameId, player.currentZoneId, playerId);
  }

  // Send a log event
  if (actualZombiesKilled > 0) {
    sendGameLogEvent(io, game.id, {
      id: (game.gameLogs.length + 1).toString(),
      timestamp: new Date(),
      type: "combat",
      message: `Player ${getPlayerNameBySocketId(
        playerId
      )} rolled ${diceResults.join(
        ", "
      )} and killed ${actualZombiesKilled} zombie${
        actualZombiesKilled > 1 ? "s" : ""
      } in zone ${zoneId} with a ${card.name}`,
      icon: "💥",
    });
  } else {
    sendGameLogEvent(io, game.id, {
      id: (game.gameLogs.length + 1).toString(),
      timestamp: new Date(),
      type: "combat",
      message: `Player ${getPlayerNameBySocketId(
        playerId
      )} rolled ${diceResults.join(
        ", "
      )} and failed to kill any zombies in zone ${zoneId} with a ${card.name}`,
      icon: "💥",
    });
  }

  return game;
}

function getRangedAttackZones(
  gameId: string,
  playerId: string,
  cardId: string,
  zone: Zone,
  io: Server
): Game {
  const game = getGameById(gameId);
  const player = game.players.find((player) => player.id === playerId);
  if (!player) {
    throw new OperationFailedError("Get ranged attack zones", {
      message: `Player not found in game ${gameId} with id ${playerId}`,
    });
  }
  const card = player.playerCards.inHand.find((card) => card?.id === cardId);
  if (!card) {
    throw new OperationFailedError("Get ranged attack zones", {
      message: `Player does not have a card with id ${cardId}`,
    });
  }
  if (card.maxRange === 0) {
    throw new OperationFailedError("Get ranged attack zones", {
      message: `Card ${cardId} is not a ranged attack`,
    });
  }
  const possibleRangedAttackZones = calculateRangedAttackZones(
    card,
    zone,
    game.map
  );

  card.possibleRangedAttackZones = possibleRangedAttackZones;
  return game;
}

function takeObjectiveToken(
  gameId: string,
  zoneId: string,
  playerId: string
): Game {
  const game = getGameById(gameId);
  const zone = game.map.zones.find((zone) => zone.id === zoneId);
  if (!zone) {
    throw new OperationFailedError("Take objective token", {
      message: `Zone not found in game ${gameId} with id ${zoneId}`,
    });
  }
  if (!zone.hasObjectiveToken) {
    throw new OperationFailedError("Take objective token", {
      message: `Zone ${zoneId} does not have an objective token`,
    });
  }
  const player = game.players.find((player) => player.id === playerId);
  if (!player) {
    throw new OperationFailedError("Take objective token", {
      message: `Player not found in game ${gameId} with id ${playerId}`,
    });
  }
  zone.hasObjectiveToken = false;
  player.actionsRemaining -= 1;
  player.XP += 5;
  game.map.winCondition.current += 1;

  if (checkWinCondition(game)) {
    game.status = "won";
  }

  return game;
}
export {
  createGame,
  deleteGame,
  getGameBySocketId,
  getGameById,
  removePlayerFromGame,
  stopPlayerDisconnectTimer,
  rejoinGame,
  getPlayerNameBySocketId,
  updatePlayerTurn,
  voteKickPlayerFromGame,
  movePlayerToZone,
  endTurn,
  openDoor,
  generateNoise,
  organiseInventory,
  searchForItems,
  discardSwappableCard,
  attackZombies,
  getRangedAttackZones,
  takeObjectiveToken,
};
