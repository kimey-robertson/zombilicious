import { Server, Socket } from "socket.io";
import { Lobby } from "../../shared/types";
import {
  createGame,
  endTurn,
  getGameById,
  movePlayerToZone,
  rejoinGame,
  voteKickPlayerFromGame,
} from "./gameManager";
import { getGamesWithDisconnectedPlayers, sendGameLogEvent } from "./gameUtils";
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
      playerSocket?.emit("game-created", game);

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

  // Temporary but can probably use similar logic later
  const skipZombiesTurnHandler = createSocketHandler<{ gameId: string }>(
    "skip-zombies-turn",
    async (io, socket, { gameId }) => {
      // Skip the zombies turn
      const game = getGameById(gameId);

      game.players[0].myTurn = true;
      game.status = "active";

      game.players.forEach(
        (player) => (player.actionsRemaining = player.totalActions)
      );

      // Send a log event
      sendGameLogEvent(io, game.id, {
        id: (game.gameLogs.length + 1).toString(),
        timestamp: new Date(),
        type: "system",
        message: `It's now player ${game.players[0].name}'s turn`,
        icon: "🔥",
      });

      // Emit the game updated
      io.to(gameId).emit("game-updated", game);

      return { success: true };
    }
  );

  createGameHandler(io, socket);
  voteKickPlayerFromGameHandler(io, socket);
  rejoinGameHandler(io, socket);
  endTurnHandler(io, socket);
  movePlayerToZoneHandler(io, socket);
  skipZombiesTurnHandler(io, socket);
};
