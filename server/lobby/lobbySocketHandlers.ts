import { Server, Socket } from "socket.io";
import {
  changeGameNameLobby,
  createLobby,
  deleteLobby,
  joinLobby,
  leaveLobby,
  toggleIsReadyLobbyPlayer,
} from "./lobbyManager";
import { Lobby } from "../../shared/types";

import { getAllLobbies } from "./lobbyUtils";

export const handleLobbyEvents = (io: Server, socket: Socket) => {
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
      const lobby = deleteLobby(lobbyId);
      if (lobby) {
        callback({ success: true });
        io.emit("lobby-deleted", { lobbyId });
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
        io.emit("lobby-updated", {
          lobbyId: lobby.id,
          gameName: lobby.gameName,
          players: lobby.players,
        });
      } else {
        callback({ success: false, errorMessage: "Lobby not found" });
      }
    }
  );

  socket.on(
    "leave-lobby",
    (
      lobbyId: string,
      callback: (data: { success: boolean; errorMessage?: string }) => void
    ) => {
      const lobby = leaveLobby(lobbyId, socket.id);
      if (lobby) {
        callback({ success: true });
        io.emit("lobby-updated", {
          lobbyId: lobby.id,
          gameName: lobby.gameName,
          players: lobby.players,
        });
      } else {
        callback({ success: false, errorMessage: "Lobby not found" });
      }
    }
  );

  socket.on(
    "toggle-is-ready-lobby-player",
    (
      playerId: string,
      callback: (data: { success: boolean; errorMessage?: string }) => void
    ) => {
      const lobby = toggleIsReadyLobbyPlayer(playerId);
      if (lobby) {
        callback({ success: true });
        io.emit("lobby-updated", {
          lobbyId: lobby.id,
          gameName: lobby.gameName,
          players: lobby.players,
        });
      } else {
        callback({ success: false, errorMessage: "Lobby not found" });
      }
    }
  );

  socket.on(
    "change-game-name-lobby",
    (
      {
        lobbyId,
        gameName,
        playerId,
      }: { lobbyId: string; gameName: string; playerId: string },
      callback: (data: { success: boolean; errorMessage?: string }) => void
    ) => {
      const lobby = changeGameNameLobby(lobbyId, gameName, playerId);
      if (lobby) {
        callback({ success: true });
        io.emit("lobby-updated", {
          lobbyId: lobby.id,
          gameName: lobby.gameName,
          players: lobby.players,
        });
      } else {
        callback({ success: false, errorMessage: "Lobby not found" });
      }
    }
  );
};
