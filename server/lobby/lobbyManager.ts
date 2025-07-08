import { Lobby } from "../../shared/types";
import {
  LobbyNotFoundError,
  LobbyPlayerNotFoundError,
  OperationFailedError,
} from "../utils/socketErrors";

export const lobbies: Lobby[] = [];

// All function in this file should return Lobby | undefined

function createLobby(
  playerSocketId: string,
  playerName: string
): Lobby | undefined {
  if (!playerSocketId || !playerName) return undefined;
  const lobbyId = Math.random().toString(36).substring(2, 6);
  const lobby: Lobby = {
    id: lobbyId,
    gameName: "Zombilicious Game",
    players: [
      {
        id: playerSocketId,
        name: playerName,
        isHost: true,
        isReady: true,
      },
    ],
  };

  lobbies.push(lobby);

  return lobby;
}

function deleteLobby(lobbyId: string): Lobby {
  if (!lobbyId) throw new OperationFailedError("Delete lobby");
  // Find the lobby
  const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
  if (!lobby) {
    throw new LobbyNotFoundError(lobbyId);
  } else {
    lobbies.splice(lobbies.indexOf(lobby), 1);
    return lobby;
  }
}

function joinLobby(
  lobbyId: string,
  playerSocketId: string,
  playerName: string
): Lobby | undefined {
  if (!lobbyId || !playerSocketId || !playerName) return undefined;
  const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
  if (lobby) {
    if (lobby.players.length >= 4) {
      return undefined;
    }
    if (lobby.players.find((player) => player.id === playerSocketId)) {
      return undefined;
    } else {
      lobby.players.push({
        id: playerSocketId,
        name: playerName,
        isHost: false,
        isReady: false,
      });
    }
  }

  return lobby;
}

function getLobbyByPlayerSocketId(playerSocketId: string): Lobby {
  if (!playerSocketId)
    throw new OperationFailedError("Get lobby by player socket id");
  const lobby = lobbies.find((lobby) =>
    lobby.players.some((player) => player.id === playerSocketId)
  );
  if (!lobby) throw new LobbyNotFoundError('', { playerSocketId });
  return lobby;
}

function leaveLobby(
  lobbyId: string,
  playerSocketId: string
): Lobby | undefined {
  if (!lobbyId || !playerSocketId) return undefined;
  const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
  if (lobby) {
    lobby.players = lobby.players.filter(
      (player) => player.id !== playerSocketId
    );
    return lobby;
  } else {
    return undefined;
  }
}

function toggleIsReadyLobbyPlayer(
  playerId: string,
  lobbyId: string
): Lobby | undefined {
  if (!playerId || !lobbyId) return undefined;

  const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
  if (!lobby) {
    throw new LobbyNotFoundError(lobbyId);
  } else {
    const player = lobby.players.find((player) => player.id === playerId);
    if (player) {
      player.isReady = !player.isReady;
    } else {
      throw new LobbyPlayerNotFoundError(playerId, lobbyId);
    }
    return lobby;
  }
}

function changeGameNameLobby(
  lobbyId: string,
  gameName: string,
  playerId: string
): Lobby | undefined {
  // If there is no lobby with the given lobbyId, or the player is not the host, return undefined
  if (!lobbyId || !gameName || !playerId) return undefined;
  const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
  if (!lobby) {
    throw new LobbyNotFoundError(lobbyId);
  } else {
    const player = lobby.players.find((player) => player.id === playerId);
    if (!player) {
      throw new LobbyPlayerNotFoundError(playerId, lobbyId);
    } else {
      if (!player.isHost) {
        return undefined;
      } else {
        lobby.gameName = gameName;
        return lobby;
      }
    }
  }
}

export {
  createLobby,
  deleteLobby,
  joinLobby,
  getLobbyByPlayerSocketId,
  leaveLobby,
  toggleIsReadyLobbyPlayer,
  changeGameNameLobby,
};
