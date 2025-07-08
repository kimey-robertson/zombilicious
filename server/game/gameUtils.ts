import { Server } from "socket.io";
import { Game, LogEvent } from "../../shared/types";
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

export {
  getPlayerNameBySocketId,
  getGamesWithDisconnectedPlayers,
  sendGameLogEvent,
  stopPlayerDisconnectTimer,
  getAllGames,
};
