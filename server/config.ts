import express from "express";
import http from "http";
import { Server } from "socket.io";
import path from "path";

export const createServer = () => {
  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: "*" } });

  // Serve the client
  app.use(express.static(path.join(__dirname, "../client/dist")));

  // Handle client-side routing (catch-all for SPA)
  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });

  const PORT = process.env.PORT || 8000;

  return { server, io, PORT };
};
