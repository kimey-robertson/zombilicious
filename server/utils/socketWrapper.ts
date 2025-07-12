import {
  SocketCallback,
  SocketErrorCodes,
  SocketHandlerFunction,
  SocketResponse,
} from "../../shared/types";
import { Server, Socket } from "socket.io";
import { SocketError } from "./socketErrors";

export function createSocketHandler<T = any>(
  eventName: string,
  handler: SocketHandlerFunction<T>
) {
  return (io: Server, socket: Socket) => {
    socket.on(eventName, async (data: T, callback: SocketCallback) => {
      try {
        console.log(`[${eventName}] Received from ${socket.id}. Data:`, data);

        await handler(io, socket, data);

        const response: SocketResponse = {
          success: true,
        };

        console.log(
          `[${eventName}] Success for ${socket.id}. Response:`,
          response
        );
        callback(response);
      } catch (error) {
        let socketError: SocketError;

        if (error instanceof SocketError) {
          socketError = error;
        } else {
          // Handle unexpected errors
          console.error(
            `[${eventName}] Unexpected error for ${socket.id}. Error:`,
            error
          );
          socketError = new SocketError(
            SocketErrorCodes.INTERNAL_ERROR,
            "An unexpected error occurred",
            process.env.NODE_ENV === "development" ? error : undefined
          );
        }

        const response: SocketResponse = {
          success: false,
          error: {
            code: socketError.code,
            message: socketError.message,
            details: socketError.details,
          },
        };

        console.log(
          `[${eventName}] Error for ${socket.id}. Response:`,
          response
        );
        if (!callback || typeof callback !== "function") {
          console.log(
            `[${eventName}] No callback for ${socket.id}. Response:`,
            response
          );
        }
        callback(response);
      }
    });
  };
}
