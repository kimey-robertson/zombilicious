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
import { createSocketHandler } from "../utils/socketWrapper";
import { OperationFailedError } from "../utils/socketErrors";

// Handles receiving events from the client, responding with callbacks,
// and emitting events to the client. Shouldn't have logic.
// Callbacks should only ever contain success boolean and error message if success is false.

export const handleLobbyEvents = (io: Server, socket: Socket) => {

  const createGameLobbyHandler = createSocketHandler<{ playerName: string }>(
    "create-game-lobby",
    async (io, socket, { playerName }) => {
      const lobby = createLobby(socket.id, playerName);

      if (!lobby) {
        throw new OperationFailedError("Create lobby");
      }

      io.emit("lobby-created", { lobby });
      return { success: true };
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

  createGameLobbyHandler(io, socket);
};
