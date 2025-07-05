import { Server } from "socket.io";
import {
  getGameBySocketId,
  getPlayerNameBySocketId,
  getGamesWithDisconnectedPlayers,
  sendLogEvent,
  removePlayerFromGame,
} from "../game/gameManager";
import { countDownTimer } from "../utils";
import { deleteLobby, getLobbyByPlayerSocketId } from "../lobby/lobbyManager";

function handleConnect(io: Server) {
  const gamesWithDisconnectedPlayers = getGamesWithDisconnectedPlayers();

  io.emit("games-with-disconnected-players", gamesWithDisconnectedPlayers);
}

function handleDisconnectFromGame(socketId: string, io: Server) {
  const game = getGameBySocketId(socketId);
  if (!game) return;
  const disconnectedPlayer = getPlayerNameBySocketId(socketId);

  sendLogEvent(io, game.id, {
    id: (game.gameLogs.length + 1).toString(),
    timestamp: new Date(),
    type: "system",
    message: `Player ${disconnectedPlayer} disconnected from game`,
    icon: "🚫",
  });

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
        sendLogEvent(io, newGame.id, {
          id: (newGame.gameLogs.length + 1).toString(),
          timestamp: new Date(),
          type: "system",
          message: `Player ${disconnectedPlayer} has been removed from game because they did not reconnect in time`,
          icon: "🚫",
        });
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
}

// If the player is in a lobby, remove them from the lobby, and if the lobby is empty, delete the lobby
function handleDisconnectFromLobby(playerSocketId: string, io: Server) {
  const lobby = getLobbyByPlayerSocketId(playerSocketId);
  if (lobby) {
    const disconnectedPlayer = lobby.players.find(
      (player) => player.id === playerSocketId
    );
    if (!disconnectedPlayer) {
      return;
    }
    lobby.players = lobby.players.filter(
      (player) => player.id !== disconnectedPlayer?.id
    );
    if (lobby.players.length === 0) {
      deleteLobby(lobby.id);
    } else {
      if (disconnectedPlayer.isHost) {
        if (lobby.players.length > 0) {
          const newHost = lobby.players[0];
          newHost.isHost = true;
        }
      }
      io.emit("lobby-updated", {
        lobbyId: lobby.id,
        players: lobby.players,
      });
    }
  }
}

export { handleConnect, handleDisconnectFromGame, handleDisconnectFromLobby };
