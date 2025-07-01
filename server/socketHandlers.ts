import { Server, Socket } from "socket.io";
import { createLobby } from "./lobbyLogic";

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
    }
  );
};
