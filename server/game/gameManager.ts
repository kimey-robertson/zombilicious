import { Server } from "socket.io";
import { Game, Lobby, LogEvent } from "../../shared/types";

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
      myTurn: player.isHost,
      totalActions: 3,
      actionsRemaining: 3,
      XP: 0,
      playerCards: { inReserve: [], inHand: [] },
    })),
    status: "active",
    disconnectedPlayers: {},
    gameLogs: [],
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

function removePlayerFromGame(
  gameId: string,
  targetPlayerId: string,
  io: Server
) {
  let game = getGameById(gameId);
  if (game) {
    if (game.players.find((player) => player.myTurn)?.id === targetPlayerId) {
      game = updatePlayerTurn(gameId, io);
      if (!game) {
        return undefined;
      }
    }
    stopPlayerDisconnectTimer(gameId, targetPlayerId);
    delete game.disconnectedPlayers[targetPlayerId];
    game.players = game.players.filter(
      (player) => player.id !== targetPlayerId
    );
    io.to(gameId).emit("game-updated", game);
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

  sendLogEvent(io, game.id, {
    id: (game.gameLogs.length + 1).toString(),
    timestamp: new Date(),
    type: "system",
    message: `Player ${getPlayerNameBySocketId(
      newPlayerId
    )} reconnected to game`,
    icon: "❤️",
  });

  // If no more disconnected players, set game status to active
  if (Object.keys(game.disconnectedPlayers).length === 0) {
    game.status = "active";
  }

  return game;
}

function sendLogEvent(io: Server, gameId: string, logEvent: LogEvent) {
  const game = getGameById(gameId);
  if (game) {
    io.to(gameId).emit("log-event", logEvent);
    game.gameLogs.push(logEvent);
  }
}

function updatePlayerTurn(gameId: string, io: Server): Game | undefined {
  const game = getGameById(gameId);
  if (game) {
    const playerIndex = game.players.findIndex((player) => player.myTurn);
    if (playerIndex !== -1) {
      game.players[playerIndex].myTurn = false;
    }
    const nextPlayer = game.players[playerIndex + 1];
    if (nextPlayer) {
      nextPlayer.myTurn = true;
      sendLogEvent(io, gameId, {
        id: (game.gameLogs.length + 1).toString(),
        timestamp: new Date(),
        type: "system",
        message: `It's now player ${nextPlayer.name}'s turn`,
        icon: "🔥",
      });
    }
    // io.to(gameId).emit("game-updated", game);
    return game;
  }
}

export {
  createGame,
  deleteGame,
  getGameBySocketId,
  getGameById,
  removePlayerFromGame,
  getGamesWithDisconnectedPlayers,
  stopPlayerDisconnectTimer,
  rejoinGame,
  sendLogEvent,
  getPlayerNameBySocketId,
  updatePlayerTurn,
};
