import { Server } from "socket.io";
import { Game, Lobby } from "../../shared/types";
import {
  getPlayerNameBySocketId,
  sendGameLogEvent,
  stopPlayerDisconnectTimer,
} from "./gameUtils";
import { tutorialMap } from "../maps";
import { GameNotFoundError, OperationFailedError } from "../utils/socketErrors";

export const games: Game[] = [];

// All function in this file should return Game or throw an error
// There should be no emits in this file

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

function deleteGame(gameId: string): Game {
  if (!gameId) throw new OperationFailedError("Delete game");

  const game = games.find((game) => game.id === gameId);
  if (!game) throw new GameNotFoundError(gameId);

  // Remove the game from the games array
  games.splice(games.indexOf(game), 1);
  return game;
}

function getGameBySocketId(socketId: string): Game {
  if (!socketId) throw new OperationFailedError("Get game by socket id");
  const game = games.find((game) =>
    game.players.some((player) => player.id === socketId)
  );
  if (!game) throw new GameNotFoundError(socketId, "in getGameBySocketId");
  return game;
}

function getGameById(gameId: string): Game {
  if (!gameId) throw new OperationFailedError("Get game by id");
  const game = games.find((game) => game.id === gameId);
  if (!game) throw new GameNotFoundError(gameId, "in getGameById");
  return game;
}

function removePlayerFromGame(
  gameId: string,
  targetPlayerId: string,
  io: Server
): Game {
  console.log("removePlayerFromGame");
  if (!gameId || !targetPlayerId || !io)
    throw new OperationFailedError("Remove player from game");

  let game = getGameById(gameId);

  if (game.players.find((player) => player.myTurn)?.id === targetPlayerId) {
    game = updatePlayerTurn(gameId, io);
  }

  // Stop the disconnect timer for this player
  stopPlayerDisconnectTimer(gameId, targetPlayerId);

  // Remove the player from the game
  delete game.disconnectedPlayers[targetPlayerId];
  game.players = game.players.filter((player) => player.id !== targetPlayerId);

  // Need to sort this
  // Check if the game is empty
  //   if (game?.players.length === 0) {
  //     game = deleteGame(gameId);
  //   }

  // Set the game status to active
  game.status = "active";

  return game;
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

function updatePlayerTurn(gameId: string, io: Server): Game {
  const game = getGameById(gameId);
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
  return game;
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
