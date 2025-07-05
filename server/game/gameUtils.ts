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
): void | undefined {
  const game = getGameById(gameId);
  if (game) {
    io.to(gameId).emit("log-event", logEvent);
    game.gameLogs.push(logEvent);
  }
}

export {
  getPlayerNameBySocketId,
  getGamesWithDisconnectedPlayers,
  sendGameLogEvent,
};
