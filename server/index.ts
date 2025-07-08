import { createServer } from "./config";
import { handleLobbyEvents } from "./lobby/lobbySocketHandlers";
import { handleGameEvents } from "./game/gameSocketHandlers";
import { handleConnectionEvents } from "./connection/connectionSocketHandlers";

const { server, io, PORT } = createServer();

io.on("connection", (socket) => {
  handleConnectionEvents(io, socket);
  handleLobbyEvents(io, socket);
  handleGameEvents(io, socket);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
