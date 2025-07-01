import { Server, Socket } from "socket.io";
import { createLobby, deleteLobby } from "./lobbyLogic";

export const handleGameEvents = (io: Server, socket: Socket) => {
  console.log("a user connected", socket.id);

  socket.on(
    "create-game-lobby",
    (
      { playerName }: { playerName: string },
      callback: (data: { success: boolean; errorMessage?: string }) => void
    ) => {
      const lobby = createLobby(socket.id, playerName);
      console.log("Lobby created with id:", lobby.id, "by", playerName);

      if (!lobby) {
        return callback({
          success: false,
          errorMessage: "Failed to create lobby",
        });
      }

      callback({ success: true });

      socket.emit("lobby-created", lobby);
    }
  );

  socket.on(
    "delete-game-lobby",
    (
      lobbyId: string,
      callback: (data: { success: boolean; errorMessage?: string }) => void
    ) => {
      const success = deleteLobby(lobbyId);
      if (success) {
        callback({ success });
      } else {
        callback({ success: false, errorMessage: "Lobby not found" });
      }
    }
  );
};
