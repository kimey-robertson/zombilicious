import { Server, Socket } from "socket.io";

export const handleGameEvents = (io: Server, socket: Socket) => {
  console.log("a user connected", socket.id);
};