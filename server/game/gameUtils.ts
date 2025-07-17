import { Server } from "socket.io";
import { Card, Game, LogEvent } from "../../shared/types";
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
  const game = getGameById(gameId);
  io.to(gameId).emit("log-event", logEvent);
  game.gameLogs.push(logEvent);
}

function stopPlayerDisconnectTimer(gameId: string, playerId: string): void {
  const game = getGameById(gameId);
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

export {
  getPlayerNameBySocketId,
  getGamesWithDisconnectedPlayers,
  sendGameLogEvent,
  stopPlayerDisconnectTimer,
  getAllGames,
  rollDice,
};
