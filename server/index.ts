import { createServer } from "./config";
import { handleLobbyEvents } from "./lobby/lobbySocketHandlers";
import { handleGameEvents } from "./game/gameSocketHandlers";
import {
  handleDisconnectFromGame,
  handleConnect,
  handleDisconnectFromLobby,
} from "./connection/connectionManager";

const { server, io, PORT } = createServer();

io.on("connection", (socket) => {
  handleConnect(io);

  handleLobbyEvents(io, socket);
  handleGameEvents(io, socket);

  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);

    handleDisconnectFromLobby(socket.id, io);
    handleDisconnectFromGame(socket.id, io);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
