import { Server, Socket } from "socket.io";
import { createLobby } from "./lobbyLogic";

export const handleGameEvents = (io: Server, socket: Socket) => {
  console.log("a user connected", socket.id);

  socket.on("create-game-lobby", ({ playerName }: { playerName: string }) => {
    const lobby = createLobby(socket.id, playerName);
    console.log("Lobby created with id:", lobby.id, "by", playerName);

    if (!lobby) {
      socket.emit("error-message", "Failed to create lobby");
      return;
    }
  });
};
