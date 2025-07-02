import { Server } from "socket.io";
import { Lobby } from "../shared/types";

const lobbies: Lobby[] = [];

function createLobby(playerSocketId: string, playerName: string) {
  const lobbyId = Math.random().toString(36).substring(2, 6);
  const lobby: Lobby = {
    id: lobbyId,
    name: "Zombilicious Game",
    players: [
      {
        id: playerSocketId,
        name: playerName,
        isHost: true,
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
    if (lobby.players.find((player) => player.id === playerSocketId)) {
      return false;
    } else {
      lobby.players.push({
        id: playerSocketId,
        name: playerName,
        isHost: false,
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

// If the player is in a lobby, remove them from the lobby, and if the lobby is empty, delete the lobby
function handleDisconnectFromLobby(playerSocketId: string, io: Server) {
  const lobby = getLobbyByPlayerSocketId(playerSocketId);
  if (lobby) {
    const disconnectedPlayer = lobby.players.find(
      (player) => player.id === playerSocketId
    );
    if (!disconnectedPlayer) {
      return;
    }
    lobby.players = lobby.players.filter(
      (player) => player.id !== disconnectedPlayer?.id
    );
    if (lobby.players.length === 0) {
      deleteLobby(lobby.id);
    } else {
      if (disconnectedPlayer.isHost) {
        if (lobby.players.length > 0) {
          const newHost = lobby.players[0];
          newHost.isHost = true;
        }
      }
      io.emit("lobby-updated", {
        lobbyId: lobby.id,
        players: lobby.players,
      });
    }
  }
}

export {
  createLobby,
  deleteLobby,
  getAllLobbies,
  joinLobby,
  getLobbyByPlayerSocketId,
  handleDisconnectFromLobby,
};
