import { Server, Socket } from "socket.io";
import { Game, Lobby } from "../../shared/types";
import {
  getPlayerNameBySocketId,
  sendGameLogEvent,
  stopPlayerDisconnectTimer,
} from "./gameUtils";
import { tutorialMap } from "../maps";
import { GameNotFoundError, OperationFailedError } from "../utils/socketErrors";

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
      playerCards: { inReserve: [], inHand: [] },
    })),
    status: "active",
    disconnectedPlayers: {},
    gameLogs: [],
    map: tutorialMap,
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
  console.log("removePlayerFromGame");
  if (!gameId || !targetPlayerId || !io)
    throw new OperationFailedError("Remove player from game");

  // Get the target player name
  const targetPlayerName = getPlayerNameBySocketId(targetPlayerId);

  // Get the game
  let game = getGameById(gameId);

  // If the target player is the current player, update the turn
  if (game.players.find((player) => player.myTurn)?.id === targetPlayerId) {
    game = updatePlayerTurn(gameId, io);
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

function updatePlayerTurn(gameId: string, io: Server): Game {
  const game = getGameById(gameId);
  const playerIndex = game.players.findIndex((player) => player.myTurn);
  if (playerIndex !== -1) {
    game.players[playerIndex].myTurn = false;
  }
  const nextPlayer = game.players[playerIndex + 1];
  if (nextPlayer) {
    nextPlayer.myTurn = true;
    sendGameLogEvent(io, gameId, {
      id: (game.gameLogs.length + 1).toString(),
      timestamp: new Date(),
      type: "system",
      message: `It's now player ${nextPlayer.name}'s turn`,
      icon: "🔥",
    });
  }
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
};
