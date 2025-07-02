import { createServer } from "./config";
import { handleDisconnectFromLobby } from "./lobby/lobbyManager";
import { handleLobbyEvents } from "./lobby/lobbySocketHandlers";
import { handleGameEvents } from "./game/gameSocketHandlers";
import { handleDisconnectFromGame } from "./game/gameManager";

const { server, io, PORT } = createServer();

io.on("connection", (socket) => {
  socket.on("disconnect", () => {
    console.log("a user disconnected", socket.id);

    handleDisconnectFromLobby(socket.id, io);

    handleDisconnectFromGame(socket.id, io);
  });

  handleLobbyEvents(io, socket);
  handleGameEvents(io, socket);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
