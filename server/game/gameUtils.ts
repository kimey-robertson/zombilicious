import { Server } from "socket.io";
import { Card, Game, LogEvent, Player } from "../../shared/types";
import { games, getGameById, getGameBySocketId } from "./gameManager";

function getPlayerNameBySocketId(socketId: string): string {
  if (!socketId) return "Unknown";
  const game = getGameBySocketId(socketId);
  if (!game) return "Unknown";

  return (
    game.players.find((player) => player.id === socketId)?.name ?? "Unknown"
  );
}

function getGamesWithDisconnectedPlayers(): Game[] {
  return games.filter(
    (game) => Object.keys(game.disconnectedPlayers).length > 0
  );
}

function sendGameLogEvent(
  io: Server,
  gameId: string,
  logEvent: LogEvent
): void {
  // Check if the game still exists before trying to access it
  // This prevents crashes when async operations (like timeouts) try to log events
  // for games that have been deleted
  const game = games.find((game) => game.id === gameId);
  if (!game) {
    // Game has been deleted, safely ignore the log event
    console.log(
      `[sendGameLogEvent] Game ${gameId} not found, skipping log event: ${logEvent.message}`
    );
    return;
  }

  io.to(gameId).emit("log-event", logEvent);
  game.gameLogs.push(logEvent);
}

function stopPlayerDisconnectTimer(gameId: string, playerId: string): void {
  // Check if the game still exists before trying to access it
  // This prevents crashes when trying to stop timers for deleted games
  const game = games.find((game) => game.id === gameId);
  if (!game) {
    console.log(
      `[stopPlayerDisconnectTimer] Game ${gameId} not found, unable to stop timer for player ${playerId}`
    );
    return;
  }

  game.disconnectedPlayers[playerId]?.stopDisconnectTimer?.();
}

function getAllGames(): Game[] {
  return games;
}

function rollDice(card: Card): {
  diceResults: number[];
  possibleZombiesKilled: number;
} {
  const diceResults = [];

  for (let i = 0; i < card.numberOfDice; i++) {
    diceResults.push(Math.floor(Math.random() * 6) + 1);
  }
  return {
    diceResults,
    possibleZombiesKilled: diceResults.filter(
      (dice) => dice >= card.rollRequired
    ).length,
  };
}

function getNextPlayer(
  game: Game,
  playerIndex: number,
  afterZombiesTurn: boolean = false
): Player | undefined {
  let nextPlayer: Player | undefined;
  if (game.players.length === 0) return undefined;
  if (afterZombiesTurn) {
    return game.players[0];
  }
  for (let i = 0; i < game.players.length; i++) {
    if (game.players[i].alive && i === playerIndex + 1) {
      nextPlayer = game.players[i];
      break;
    }
  }
  return nextPlayer;
}

export {
  getPlayerNameBySocketId,
  getGamesWithDisconnectedPlayers,
  sendGameLogEvent,
  stopPlayerDisconnectTimer,
  getAllGames,
  rollDice,
  getNextPlayer,
};
