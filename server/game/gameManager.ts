import { Server } from "socket.io";
import { Game, Lobby } from "../../shared/types";
import { getPlayerNameBySocketId, sendGameLogEvent } from "./gameUtils";
import { tutorialMap } from "../maps";

export const games: Game[] = [];

// All function in this file should return Game | undefined

function createGame(lobby: Lobby): Game | undefined {
  if (games.find((game) => game.id === lobby.id) || !lobby) {
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
    map: tutorialMap,
  };

  games.push(game);

  return game;
}

function deleteGame(gameId: string): Game | undefined {
  if (!gameId) return undefined;
  const game = games.find((game) => game.id === gameId);
  if (game) {
    games.splice(games.indexOf(game), 1);
    return game;
  }
  return undefined;
}

function getGameBySocketId(socketId: string): Game | undefined {
  if (!socketId) return undefined;
  return games.find((game) =>
    game.players.some((player) => player.id === socketId)
  );
}

function getGameById(gameId: string): Game | undefined {
  if (!gameId) return undefined;
  return games.find((game) => game.id === gameId);
}

function removePlayerFromGame(
  gameId: string,
  targetPlayerId: string,
  io: Server
): Game | undefined {
  if (!gameId || !targetPlayerId || !io) return undefined;
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
): Game | undefined {
  if (!gameId || !playerIdFromLocalStorage || !newPlayerId || !io) {
    return undefined;
  }
  const game = getGameById(gameId);
  if (!game) {
    return undefined;
  }

  // Check if player is actually disconnected from this game
  if (!game.disconnectedPlayers[playerIdFromLocalStorage]) {
    return undefined;
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

  sendGameLogEvent(io, game.id, {
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
      sendGameLogEvent(io, gameId, {
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
  stopPlayerDisconnectTimer,
  rejoinGame,
  getPlayerNameBySocketId,
  updatePlayerTurn,
};
