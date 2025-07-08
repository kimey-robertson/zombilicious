import { Server, Socket } from "socket.io";
import { handleConnect, handleDisconnectFromLobby } from "./connectionManager";
import { handleDisconnectFromGame } from "./connectionManager";
import {
  getGamesWithDisconnectedPlayers,
  getPlayerNameBySocketId,
  sendGameLogEvent,
} from "../game/gameUtils";
import { removePlayerFromGame } from "../game/gameManager";

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

  socket.on(
    "leave-disconnected-game",
    (
      { gameId, playerId }: { gameId: string; playerId: string },
      callback: (data: { success: boolean; errorMessage?: string }) => void
    ) => {
      const playerName = getPlayerNameBySocketId(playerId);
      const game = removePlayerFromGame(gameId, playerId, io);
      if (game) {
        game.status = "active";
        const gamesWithDisconnectedPlayers = getGamesWithDisconnectedPlayers();
        io.emit(
          "games-with-disconnected-players",
          gamesWithDisconnectedPlayers
        );
        io.to(game.id).emit("game-updated", game);
        sendGameLogEvent(io, game.id, {
          id: (game.gameLogs.length + 1).toString(),
          timestamp: new Date(),
          type: "system",
          message: `Player ${playerName} has chosen to abandon you..`,
          icon: "🚫",
        });
        callback({ success: true });
      } else {
        callback({ success: false, errorMessage: "Game not found" });
      }
    }
  );
};
