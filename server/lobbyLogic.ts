import { Lobby } from "../shared/types";

const lobbies: Lobby[] = [];

function createLobby(playerSocketId: string, playerName: string) {
  const lobbyId = Math.random().toString(36).substring(2, 6);
  const lobby: Lobby = {
    id: lobbyId,
    name: `Zombilicious Game | ${lobbyId}`,
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

export { createLobby, deleteLobby };
