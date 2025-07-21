import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const getSocket = (): Socket => {
  if (!socket) {
    socket = io(
      process.env.NODE_ENV === "production"
        ? "https://zombilicious-production.up.railway.app/"
        : "http://localhost:8000",
      {
        // Prevent frequent reconnections
        reconnectionDelay: 1000,
        reconnectionDelayMax: 5000,
        reconnectionAttempts: 5,
      }
    );
  }
  return socket;
};

export { socket };
