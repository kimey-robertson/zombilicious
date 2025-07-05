import { Server } from "socket.io";
import { Lobby } from "../../shared/types";
import { getGamesWithDisconnectedPlayers } from "../game/gameManager";

const lobbies: Lobby[] = [];

function createLobby(playerSocketId: string, playerName: string) {
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

function deleteLobby(lobbyId: string) {
  const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
  if (lobby) {
    lobbies.splice(lobbies.indexOf(lobby), 1);
    console.log("Deleted lobby", lobby.id);
    return true;
  } else {
    return false;
  }
}

function getAllLobbies() {
  return lobbies;
}

function joinLobby(
  lobbyId: string,
  playerSocketId: string,
  playerName: string
) {
  const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
  if (lobby) {
    if (lobby.players.length >= 4) {
      return false;
    }
    if (lobby.players.find((player) => player.id === playerSocketId)) {
      return false;
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

function getLobbyByPlayerSocketId(playerSocketId: string): Lobby | undefined {
  return lobbies.find((lobby) =>
    lobby.players.some((player) => player.id === playerSocketId)
  );
}

function leaveLobby(
  lobbyId: string,
  playerSocketId: string
): Lobby | undefined {
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

function toggleIsReadyLobbyPlayer(playerId: string): Lobby | undefined {
  const lobby = lobbies.find((lobby) =>
    lobby.players.some((player) => player.id === playerId)
  );
  if (lobby) {
    const player = lobby.players.find((player) => player.id === playerId);
    if (player) {
      player.isReady = !player.isReady;
    }
    return lobby;
  } else {
    return undefined;
  }
}

function changeGameNameLobby(
  lobbyId: string,
  gameName: string,
  playerId: string
): Lobby | undefined {
  // If there is no lobby with the given lobbyId, or the player is not the host, return undefined
  const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
  if (lobby) {
    const player = lobby.players.find((player) => player.id === playerId);
    if (!player || !player.isHost) {
      return undefined;
    }
    lobby.gameName = gameName;
    return lobby;
  } else {
    return undefined;
  }
}

export {
  createLobby,
  deleteLobby,
  getAllLobbies,
  joinLobby,
  getLobbyByPlayerSocketId,
  leaveLobby,
  toggleIsReadyLobbyPlayer,
  changeGameNameLobby,
};
