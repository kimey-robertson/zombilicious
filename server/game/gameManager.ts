import { Server } from "socket.io";
import { Game, Lobby } from "../../shared/types";
import { countDownTimer } from "../utils";

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

function getGameById(gameId: string): Game | undefined {
  return games.find((game) => game.id === gameId);
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
    id: socketId,
  };

  game.status = "paused";

  io.to(game.id).emit("game-updated", game);

  const stopTimer = countDownTimer((time) => {
    if (time === "00:00") {
      const newGame = removePlayerFromGame(game.id, socketId, io);
      if (newGame) {
        newGame.status = "active";
        io.to(newGame.id).emit("game-updated", newGame);
        const gamesWithDisconnectedPlayers = getGamesWithDisconnectedPlayers();
        io.emit(
          "games-with-disconnected-players",
          gamesWithDisconnectedPlayers
        );
      }
    } else {
      io.emit("updated-disconnect-timer", {
        time,
        playerId: socketId,
      });
    }
  });

  game.disconnectedPlayers[socketId].stopDisconnectTimer = stopTimer;
  console.log(
    "game.disconnectedPlayers[socketId]",
    game.disconnectedPlayers[socketId]
  );
}

function removePlayerFromGame(
  gameId: string,
  targetPlayerId: string,
  io: Server
) {
  const game = getGameById(gameId);
  if (game) {
    stopPlayerDisconnectTimer(gameId, targetPlayerId);
    delete game.disconnectedPlayers[targetPlayerId];
    game.players = game.players.filter(
      (player) => player.id !== targetPlayerId
    );
    io.emit("player-removed-from-game", targetPlayerId);
    return game;
  } else {
    return undefined;
  }
}

function getGamesWithDisconnectedPlayers(): Game[] {
  return games.filter(
    (game) => Object.keys(game.disconnectedPlayers).length > 0
  );
}

function stopPlayerDisconnectTimer(gameId: string, playerId: string) {
  const game = getGameById(gameId);
  if (game) {
    game.disconnectedPlayers[playerId]?.stopDisconnectTimer?.();
  }
}

function rejoinGame(
  gameId: string,
  playerIdFromLocalStorage: string,
  newPlayerId: string,
  io: Server
) {
  const game = getGameById(gameId);
  if (!game) {
    return null;
  }

  // Check if player is actually disconnected from this game
  if (!game.disconnectedPlayers[playerIdFromLocalStorage]) {
    return null;
  }

  // Stop the disconnect timer for this player
  stopPlayerDisconnectTimer(gameId, playerIdFromLocalStorage);

  // Remove player from disconnected players
  delete game.disconnectedPlayers[playerIdFromLocalStorage];

  // Join the player's socket to the game room
  const playerSocket = io.sockets.sockets.get(newPlayerId);
  if (playerSocket) {
    playerSocket.join(gameId);
    console.log(
      `Player ${newPlayerId} with previous id ${playerIdFromLocalStorage} rejoined game ${gameId}`
    );
  }

  // Switch the player's id with the new player's id
  const playerIndex = game.players.findIndex(
    (player) => player.id === playerIdFromLocalStorage
  );
  if (playerIndex !== -1) {
    game.players[playerIndex].id = newPlayerId;
  }

  // If no more disconnected players, set game status to active
  if (Object.keys(game.disconnectedPlayers).length === 0) {
    game.status = "active";
  }

  return game;
}

export {
  createGame,
  deleteGame,
  handleDisconnectFromGame,
  getGameBySocketId,
  getGameById,
  removePlayerFromGame,
  getGamesWithDisconnectedPlayers,
  stopPlayerDisconnectTimer,
  rejoinGame,
};
