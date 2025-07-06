import { Server, Socket } from "socket.io";
import {
  changeGameNameLobby,
  createLobby,
  deleteLobby,
  joinLobby,
  leaveLobby,
  toggleIsReadyLobbyPlayer,
} from "./lobbyManager";

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

  const deleteGameLobbyHandler = createSocketHandler<{ lobbyId: string }>(
    "delete-game-lobby",
    async (io, socket, { lobbyId }) => {
      const lobby = deleteLobby(lobbyId);

      if (!lobby) {
        throw new OperationFailedError("Delete lobby");
      }

      io.emit("lobby-deleted", { lobbyId });
      return { success: true };
    }
  );

  const fetchLobbiesHandler = createSocketHandler<void>(
    "fetch-lobbies",
    async (io, socket) => {
      const allLobbies = getAllLobbies();
      io.emit("lobbies-fetched", { allLobbies });
      return { success: true };
    }
  );

  const joinLobbyHandler = createSocketHandler<{
    lobbyId: string;
    playerName: string;
  }>("join-lobby", async (io, socket, { lobbyId, playerName }) => {
    const lobby = joinLobby(lobbyId, socket.id, playerName);

    if (!lobby) {
      throw new OperationFailedError("Join lobby");
    }

    io.emit("lobby-updated", {
      lobbyId: lobby.id,
      gameName: lobby.gameName,
      players: lobby.players,
    });
    return { success: true };
  });

  const leaveLobbyHandler = createSocketHandler<{ lobbyId: string }>(
    "leave-lobby",
    async (io, socket, { lobbyId }) => {
      const lobby = leaveLobby(lobbyId, socket.id);

      if (!lobby) {
        throw new OperationFailedError("Leave lobby");
      }

      io.emit("lobby-updated", {
        lobbyId: lobby.id,
        gameName: lobby.gameName,
        players: lobby.players,
      });

      return { success: true };
    }
  );

  const toggleIsReadyLobbyPlayerHandler = createSocketHandler<{
    playerId: string;
    lobbyId: string;
  }>(
    "toggle-is-ready-lobby-player",
    async (io, socket, { playerId, lobbyId }) => {
      const lobby = toggleIsReadyLobbyPlayer(playerId, lobbyId);

      if (!lobby) {
        throw new OperationFailedError("Toggle is ready lobby player");
      }

      io.emit("lobby-updated", {
        lobbyId: lobby.id,
        gameName: lobby.gameName,
        players: lobby.players,
      });

      return { success: true };
    }
  );

  const changeGameNameLobbyHandler = createSocketHandler<{
    lobbyId: string;
    gameName: string;
    playerId: string;
  }>(
    "change-game-name-lobby",
    async (io, socket, { lobbyId, gameName, playerId }) => {
      const lobby = changeGameNameLobby(lobbyId, gameName, playerId);

      if (!lobby) {
        throw new OperationFailedError("Change game name lobby");
      }

      io.emit("lobby-updated", {
        lobbyId: lobby.id,
        gameName: lobby.gameName,
        players: lobby.players,
      });

      return { success: true };
    }
  );

  createGameLobbyHandler(io, socket);
  deleteGameLobbyHandler(io, socket);
  fetchLobbiesHandler(io, socket);
  joinLobbyHandler(io, socket);
  leaveLobbyHandler(io, socket);
  toggleIsReadyLobbyPlayerHandler(io, socket);
  changeGameNameLobbyHandler(io, socket);
};
