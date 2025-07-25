import { Server } from "socket.io";
import {
  deleteGame,
  getPlayerNameBySocketId,
  removePlayerFromGame,
} from "../game/gameManager";
import { countDownTimer } from "../utils/helpers";
import { deleteLobby } from "../lobby/lobbyManager";
import {
  getAllGames,
  getGamesWithDisconnectedPlayers,
  sendGameLogEvent,
} from "../game/gameUtils";
import { OperationFailedError } from "../utils/socketErrors";
import { getAllLobbies } from "../lobby/lobbyUtils";

// Handles receiving events from the client, responding with callbacks,
// and emitting events to the client. Shouldn't have logic.
// Should return success true boolean or throw an error somewhere in the handler.

function handleConnect(io: Server) {
  const gamesWithDisconnectedPlayers = getGamesWithDisconnectedPlayers();

  io.emit("games-with-disconnected-players", gamesWithDisconnectedPlayers);
}

function handleDisconnectFromGame(socketId: string, io: Server) {
  // If no game is found, ignore this functon
  // This is custom and doesn't follow the same pattern as the other sockets, just because it's a special case

  const game = getAllGames().find((game) =>
    game.players.some((player) => player.id === socketId)
  );
  if (!game) return;
  const disconnectedPlayer = getPlayerNameBySocketId(socketId);

  sendGameLogEvent(io, game.id, {
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
        sendGameLogEvent(io, newGame.id, {
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
      // If the game is empty, delete the game
      if (newGame?.players.length === 0) {
        deleteGame(newGame.id);
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
function handleDisconnectFromLobby(playerSocketId: string, io: Server): void {
  // If the player is in a game, or there is no lobby, ignore this functon
  // This is custom and doesn't follow the same pattern as the other sockets, just because it's a special case

  const game = getAllGames().find((game) =>
    game.players.some((player) => player.id === playerSocketId)
  );

  let lobby = getAllLobbies().find((lobby) =>
    lobby.players.some((player) => player.id === playerSocketId)
  );
  if (game || !lobby) return;

  // Find the player
  const disconnectedPlayer = lobby.players.find(
    (player) => player.id === playerSocketId
  );
  if (!disconnectedPlayer) {
    throw new OperationFailedError("Couldn't find player in lobby");
  } else {
    // Remove the player from the lobby
    lobby.players = lobby.players.filter(
      (player) => player.id !== disconnectedPlayer?.id
    );
    // If the lobby is empty, delete the lobby
    if (lobby.players.length === 0) {
      lobby = deleteLobby(lobby.id);
    } else {
      // If the player is the host, find a new host
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
