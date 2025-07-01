import { createServer } from "./config";
import { handleGameEvents } from "./socketHandlers";

const { server, io, PORT } = createServer();

io.on("connection", (socket) => {
  handleGameEvents(io, socket);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
