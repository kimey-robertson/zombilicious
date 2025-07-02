import { Server, Socket } from "socket.io";
import { Lobby } from "../../shared/types";
import { createGame, deleteGame } from "./gameManager";
import { deleteLobby } from "../lobby/lobbyManager";

export const handleGameEvents = (io: Server, socket: Socket) => {
  socket.on(
    "create-game",
    (
      lobby: Lobby,
      callback: (data: { success: boolean; errorMessage?: string }) => void
    ) => {
      // Create game. If successful, delete lobby. If lobby not deleted, delete game. If game not deleted, return error. Shouldn't get that far!
      const game = createGame(lobby);
      if (game) {
        const deletedLobby = deleteLobby(lobby.id);
        if (!deletedLobby) {
          const deletedGame = deleteGame(game.id);
          if (!deletedGame) {
            return callback({
              success: false,
              errorMessage:
                "Failed to delete game. Lobby not deleted. Find help.",
            });
          }
          return callback({
            success: false,
            errorMessage: "Failed to delete lobby. Game not created.",
          });
        } else {
          io.emit("game-created", game);
          console.log("game created", game);
          return callback({ success: true });
        }
      } else {
        callback({ success: false, errorMessage: "Failed to create game" });
      }
    }
  );
};
