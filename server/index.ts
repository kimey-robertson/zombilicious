import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("/{*any}", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
