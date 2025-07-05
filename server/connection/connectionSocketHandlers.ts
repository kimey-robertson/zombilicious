import { Server, Socket } from "socket.io";
import { handleConnect, handleDisconnectFromLobby } from "./connectionManager";
import { handleDisconnectFromGame } from "./connectionManager";

export const handleConnectionEvents = (io: Server, socket: Socket) => {
  handleConnect(io);

  socket.on("disconnect", () => {
    handleDisconnectFromLobby(socket.id, io);
    handleDisconnectFromGame(socket.id, io);
  });
};
