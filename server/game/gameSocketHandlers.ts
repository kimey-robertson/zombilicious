import { Server, Socket } from "socket.io";
import { Lobby, PlayerCards, Zone } from "../../shared/types";
import {
  createGame,
  discardSwappableCard,
  endTurn,
  generateNoise,
  getRangedAttackZones,
  attackZombies,
  movePlayerToZone,
  openDoor,
  organiseInventory,
  rejoinGame,
  searchForItems,
  voteKickPlayerFromGame,
  removePlayerFromGame,
  deleteGame,
  takeObjectiveToken,
} from "./gameManager";
import {
  getGamesWithDisconnectedPlayers,
  getPlayerNameBySocketId,
  sendGameLogEvent,
} from "./gameUtils";
import { deleteLobby } from "../lobby/lobbyManager";
import { createSocketHandler } from "../utils/socketWrapper";

// Handles receiving events from the client, responding with callbacks,
// and emitting events to the client. Shouldn't have logic.
// Should return success true boolean or throw an error somewhere in the handler.

export const handleGameEvents = (io: Server, socket: Socket) => {
  const createGameHandler = createSocketHandler<Lobby>(
    "create-game",
    async (io, socket, lobby) => {
      // Create the game
      const game = createGame(lobby, io);

      // Delete the lobby
      deleteLobby(lobby.id);

      // Emit the game created
      io.to(game.id).emit("game-created", game);

      return { success: true };
    }
  );

  const voteKickPlayerFromGameHandler = createSocketHandler<{
    gameId: string;
    targetPlayerId: string;
    votingPlayerId: string;
  }>(
    "vote-kick-player-from-game",
    async (io, socket, { gameId, targetPlayerId, votingPlayerId }) => {
      // Vote to kick the player from the game
      const game = voteKickPlayerFromGame(
        gameId,
        targetPlayerId,
        votingPlayerId,
        io
      );

      // Emit the games with disconnected players
      const gamesWithDisconnectedPlayers = getGamesWithDisconnectedPlayers();
      io.emit("games-with-disconnected-players", gamesWithDisconnectedPlayers);

      // Emit the game updated
      io.to(game.id).emit("game-updated", game);

      return { success: true };
    }
  );

  const rejoinGameHandler = createSocketHandler<{
    gameId: string;
    playerIdFromLocalStorage: string;
    newPlayerId: string;
  }>(
    "rejoin-game",
    async (io, socket, { gameId, playerIdFromLocalStorage, newPlayerId }) => {
      // Get the player socket
      const playerSocket = io.sockets.sockets.get(newPlayerId);

      // Rejoin the game
      const game = rejoinGame(
        gameId,
        playerIdFromLocalStorage,
        newPlayerId,
        playerSocket,
        io
      );

      // Emit game-updated to all players in the game
      io.to(game.id).emit("game-updated", game);

      // Update the list of games with disconnected players
      const gamesWithDisconnectedPlayers = getGamesWithDisconnectedPlayers();
      io.emit("games-with-disconnected-players", gamesWithDisconnectedPlayers);

      // Send the game state to the rejoining player
      playerSocket?.emit("game-rejoined", { game, newPlayerId });

      return { success: true };
    }
  );

  const endTurnHandler = createSocketHandler<{ gameId: string }>(
    "end-turn",
    async (io, socket, { gameId }) => {
      // End the turn
      const game = endTurn(gameId, io);

      // Emit the game updated
      io.to(gameId).emit("game-updated", game);

      return { success: true };
    }
  );

  const movePlayerToZoneHandler = createSocketHandler<{
    gameId: string;
    playerId: string;
    fromZoneId: string;
    toZoneId: string;
  }>(
    "move-player-to-zone",
    async (io, socket, { gameId, playerId, fromZoneId, toZoneId }) => {
      // Move the player to the zone
      const game = movePlayerToZone(gameId, playerId, fromZoneId, toZoneId, io);

      // Emit the game updated
      io.to(gameId).emit("game-updated", game);

      return { success: true };
    }
  );

  const openDoorHandler = createSocketHandler<{
    gameId: string;
    playerId: string;
    doorId: string;
  }>("open-door", async (io, socket, { gameId, playerId, doorId }) => {
    // Open the door
    const game = openDoor(gameId, playerId, doorId);

    // Send a log event
    sendGameLogEvent(io, game.id, {
      id: (game.gameLogs.length + 1).toString(),
      timestamp: new Date(),
      type: "system",
      message: `Player ${getPlayerNameBySocketId(
        playerId
      )} opened door ${doorId}`,
      icon: "🚪",
    });

    // Emit the game updated
    io.to(gameId).emit("game-updated", game);

    return { success: true };
  });

  const makeNoiseHandler = createSocketHandler<{
    gameId: string;
    zoneId: string;
    playerId: string;
  }>("make-noise", async (io, socket, { gameId, zoneId, playerId }) => {
    // Make noise
    const game = generateNoise(gameId, zoneId, playerId, true);

    // Send a log event
    sendGameLogEvent(io, game.id, {
      id: (game.gameLogs.length + 1).toString(),
      timestamp: new Date(),
      type: "system",
      message: `Player ${getPlayerNameBySocketId(
        socket.id
      )} made noise in zone ${zoneId}`,
      icon: "🔊",
    });

    // Emit the game updated
    io.to(gameId).emit("game-updated", game);

    return { success: true };
  });

  const organiseInventoryHandler = createSocketHandler<{
    gameId: string;
    playerId: string;
    playerCards: PlayerCards;
    asAction: boolean;
  }>(
    "organise-inventory",
    async (io, socket, { gameId, playerId, playerCards, asAction }) => {
      // Organise the inventory
      const game = organiseInventory(gameId, playerId, playerCards, asAction);

      // Emit the game updated
      io.to(gameId).emit("game-updated", game);

      return { success: true };
    }
  );

  const searchForItemsHandler = createSocketHandler<{
    gameId: string;
    zoneId: string;
    playerId: string;
  }>("search-for-items", async (io, socket, { gameId, zoneId, playerId }) => {
    // Search the zone
    const game = searchForItems(gameId, zoneId, playerId, io);

    // Emit the game updated
    io.to(gameId).emit("game-updated", game);

    return { success: true };
  });

  const discardSwappableCardHandler = createSocketHandler<{
    gameId: string;
    playerId: string;
    playerCards: PlayerCards;
  }>(
    "discard-swappable-card",
    async (io, socket, { gameId, playerId, playerCards }) => {
      // Discard the swappable card
      const game = discardSwappableCard(gameId, playerId, playerCards, io);

      // Emit the game updated
      io.to(gameId).emit("game-updated", game);

      return { success: true };
    }
  );

  const meleeAttackHandler = createSocketHandler<{
    gameId: string;
    playerId: string;
    cardId: string;
    zoneId: string;
  }>(
    "melee-attack",
    async (io, socket, { gameId, playerId, cardId, zoneId }) => {
      // Melee attack
      const game = attackZombies(gameId, playerId, cardId, zoneId, io, "melee");

      // Emit the game updated
      io.to(gameId).emit("game-updated", game);

      return { success: true };
    }
  );

  const getRangedAttackZonesHandler = createSocketHandler<{
    gameId: string;
    playerId: string;
    cardId: string;
    zone: Zone;
  }>(
    "get-ranged-attack-zones",
    async (io, socket, { gameId, playerId, cardId, zone }) => {
      // Get the ranged attack zones
      const game = getRangedAttackZones(gameId, playerId, cardId, zone, io);

      // Emit the game updated
      io.to(gameId).emit("game-updated", game);

      return { success: true };
    }
  );

  const rangedAttackHandler = createSocketHandler<{
    gameId: string;
    playerId: string;
    cardId: string;
    zoneId: string;
  }>(
    "ranged-attack",
    async (io, socket, { gameId, playerId, cardId, zoneId }) => {
      // Ranged attack
      const game = attackZombies(
        gameId,
        playerId,
        cardId,
        zoneId,
        io,
        "ranged"
      );

      // Emit the game updated
      io.to(gameId).emit("game-updated", game);

      return { success: true };
    }
  );

  const deadPlayerLeaveGameHandler = createSocketHandler<{
    gameId: string;
    playerId: string;
  }>("dead-player-leave-game", async (io, socket, { gameId, playerId }) => {
    // Dead player leave game
    const game = removePlayerFromGame(gameId, playerId, io, "dead");

    if (game.players.length === 0) {
      deleteGame(gameId);
    }

    // Emit the game updated
    io.to(gameId).emit("game-updated", game);

    return { success: true };
  });

  const takeObjectiveTokenHandler = createSocketHandler<{
    gameId: string;
    zoneId: string;
    playerId: string;
  }>(
    "take-objective-token",
    async (io, socket, { gameId, zoneId, playerId }) => {
      // Take the objective token
      const game = takeObjectiveToken(gameId, zoneId, playerId);

      // Send a log event
      sendGameLogEvent(io, game.id, {
        id: (game.gameLogs.length + 1).toString(),
        timestamp: new Date(),
        type: "system",
        message: `Player ${getPlayerNameBySocketId(
          playerId
        )} took the objective token ${
          game.status === "won" ? "and won the game!" : ""
        }`,
        icon: "🏆",
      });

      // Emit the game updated
      io.to(gameId).emit("game-updated", game);

      // Delete the game
      deleteGame(gameId);

      return { success: true };
    }
  );

  createGameHandler(io, socket);
  voteKickPlayerFromGameHandler(io, socket);
  rejoinGameHandler(io, socket);
  endTurnHandler(io, socket);
  movePlayerToZoneHandler(io, socket);
  openDoorHandler(io, socket);
  makeNoiseHandler(io, socket);
  organiseInventoryHandler(io, socket);
  searchForItemsHandler(io, socket);
  discardSwappableCardHandler(io, socket);
  meleeAttackHandler(io, socket);
  getRangedAttackZonesHandler(io, socket);
  rangedAttackHandler(io, socket);
  deadPlayerLeaveGameHandler(io, socket);
  takeObjectiveTokenHandler(io, socket);
};
