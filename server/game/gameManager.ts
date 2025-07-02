import { Server } from "socket.io";
import { Game, Lobby } from "../../shared/types";

const games: Game[] = [];

function createGame(lobby: Lobby): Game | undefined {
  if (games.find((game) => game.id === lobby.id)) {
    return undefined;
  }

  const game: Game = {
    id: lobby.id,
    name: lobby.gameName,
    players: lobby.players.map((player) => ({
      id: player.id,
      name: player.name,
    })),
    status: "active",
    disconnectedPlayers: {},
  };

  games.push(game);

  return game;
}

function deleteGame(gameId: string): Game | undefined {
  const game = games.find((game) => game.id === gameId);
  if (game) {
    games.splice(games.indexOf(game), 1);
    return game;
  }
  return undefined;
}

function getGameBySocketId(socketId: string): Game | undefined {
  return games.find((game) =>
    game.players.some((player) => player.id === socketId)
  );
}

function getPlayerNameBySocketId(socketId: string): string {
  const game = getGameBySocketId(socketId);
  if (!game) return "Unknown";

  return (
    game.players.find((player) => player.id === socketId)?.name ?? "Unknown"
  );
}

function handleDisconnectFromGame(socketId: string, io: Server) {
  const game = getGameBySocketId(socketId);
  if (!game) return;
  const disconnectedPlayer = getPlayerNameBySocketId(socketId);

  game.disconnectedPlayers[socketId] = {
    name: disconnectedPlayer,
    disconnectedAt: new Date(),
    kickVotes: [],
  };

  game.status = "paused";

  io.to(game.id).emit("game-updated", game);
}

export { createGame, deleteGame, handleDisconnectFromGame };
