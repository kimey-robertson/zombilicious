import { Server, Socket } from "socket.io";
import { handleConnect, handleDisconnectFromLobby } from "./connectionManager";
import { handleDisconnectFromGame } from "./connectionManager";
import {
  getGamesWithDisconnectedPlayers,
  getPlayerNameBySocketId,
  sendGameLogEvent,
} from "../game/gameUtils";
import { removePlayerFromGame } from "../game/gameManager";
import { createSocketHandler } from "../utils/socketWrapper";

// Handles receiving events from the client, responding with callbacks,
// and emitting events to the client. Shouldn't have logic.
// Callbacks should only ever contain success boolean and error message if success is false.

export const handleConnectionEvents = (io: Server, socket: Socket) => {
  handleConnect(io);

  socket.on("disconnect", () => {
    // Manual error handling for disconnect, we don't want to wrap it in the socket wrapper
    try {
      handleDisconnectFromLobby(socket.id, io);
      handleDisconnectFromGame(socket.id, io);
    } catch (error) {
      console.error(
        `[disconnect] Error handling disconnect for ${socket.id}:`,
        error
      );
    }
  });

  const leaveDisconnectedGameHandler = createSocketHandler<{
    gameId: string;
    playerId: string;
  }>("leave-disconnected-game", async (io, socket, { gameId, playerId }) => {
    const game = removePlayerFromGame(gameId, playerId, io, "chose-to-leave");

    // Emit the game update
    io.to(gameId).emit("game-updated", game);

    // Emit the player removed from game
    io.emit("player-removed-from-game", playerId);

    // Emit the games with disconnected players
    const gamesWithDisconnectedPlayers = getGamesWithDisconnectedPlayers();
    io.emit("games-with-disconnected-players", gamesWithDisconnectedPlayers);

    return { success: true };
  });

  leaveDisconnectedGameHandler(io, socket);
};
