import { Lobby } from "../shared/types";

const lobbies = [];

function createLobby(playerSocketId: string, playerName: string) {
  const lobby: Lobby = {
    id: Math.random().toString(36).substring(2, 6), // short ID ,
    name: "Zombilicious Game",
    players: [
      {
        id: playerSocketId,
        name: playerName,
      },
    ],
  };

  lobbies.push(lobby);

  return lobby;
}

export { createLobby };
