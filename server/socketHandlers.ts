import { Server, Socket } from "socket.io";
import {
  createLobby,
  deleteLobby,
  getAllLobbies,
  joinLobby,
} from "./lobbyLogic";
import { Lobby } from "../shared/types";

export const handleGameEvents = (io: Server, socket: Socket) => {
  console.log("a user connected", socket.id);

  socket.on(
    "create-game-lobby",
    (
      { playerName }: { playerName: string },
      callback: (data: {
        success: boolean;
        errorMessage?: string;
        lobby?: Lobby;
      }) => void
    ) => {
      const lobby = createLobby(socket.id, playerName);
      console.log("Lobby created with id:", lobby.id, "by", playerName);

      if (!lobby) {
        return callback({
          success: false,
          errorMessage: "Failed to create lobby",
        });
      }

      callback({ success: true, lobby });
    }
  );

  socket.on(
    "delete-game-lobby",
    (
      lobbyId: string,
      callback: (data: { success: boolean; errorMessage?: string }) => void
    ) => {
      const success = deleteLobby(lobbyId);
      if (success) {
        callback({ success });
      } else {
        callback({ success: false, errorMessage: "Lobby not found" });
      }
    }
  );

  socket.on(
    "fetch-lobbies",
    (callback: (data: { lobbies: Lobby[] }) => void) => {
      callback({ lobbies: getAllLobbies() });
    }
  );

  socket.on(
    "join-lobby",
    (
      { lobbyId, playerName }: { lobbyId: string; playerName: string },
      callback: (data: { success: boolean; errorMessage?: string }) => void
    ) => {
      const lobby = joinLobby(lobbyId, socket.id, playerName);
      if (lobby) {
        callback({ success: true });
      } else {
        callback({ success: false, errorMessage: "Lobby not found" });
      }
    }
  );
};
