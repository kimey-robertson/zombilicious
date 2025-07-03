import { Server, Socket } from "socket.io";
import { Lobby } from "../../shared/types";
import {
  createGame,
  deleteGame,
  getGameBySocketId,
  removePlayerFromGame,
} from "./gameManager";
import { deleteLobby } from "../lobby/lobbyManager";

export const handleGameEvents = (io: Server, socket: Socket) => {
  socket.on(
    "create-game",
    (
      lobby: Lobby,
      callback: (data: { success: boolean; errorMessage?: string }) => void
    ) => {
      // Create game. If successful, delete lobby. If lobby not deleted, delete game. If game not deleted, return error. Shouldn't get that far!
      const game = createGame(lobby);
      if (game) {
        const deletedLobby = deleteLobby(lobby.id);
        if (!deletedLobby) {
          const deletedGame = deleteGame(game.id);
          if (!deletedGame) {
            return callback({
              success: false,
              errorMessage:
                "Failed to delete game. Lobby not deleted. Find help.",
            });
          }
          return callback({
            success: false,
            errorMessage: "Failed to delete lobby. Game not created.",
          });
        } else {
          // Join all players from the lobby to the game
          lobby.players.forEach((player) => {
            const playerSocket = io.sockets.sockets.get(player.id);
            if (playerSocket) {
              playerSocket.join(game.id);
              console.log(`Player ${player.name} joined game ${game.id}`);
            }
          });
          // Emit game-created only to players in this game
          io.to(game.id).emit("game-created", game);
          console.log("game created", game);
          return callback({ success: true });
        }
      } else {
        callback({ success: false, errorMessage: "Failed to create game" });
      }
    }
  );

  socket.on(
    "vote-kick-player-from-game",
    (
      data: {
        gameId: string;
        targetPlayerId: string;
        votingPlayerId: string;
      },
      callback: (data: { success: boolean; errorMessage?: string }) => void
    ) => {
      console.log("vote-kick-player-from-game", data);
      let game = getGameBySocketId(socket.id);
      if (game) {
        game.disconnectedPlayers[data.targetPlayerId].kickVotes.push(
          data.votingPlayerId
        );
        if (
          game.disconnectedPlayers[data.targetPlayerId]?.kickVotes?.length ===
          game.players?.length - 1
        ) {
          console.log("removing player");
          game = removePlayerFromGame(game.id, data.targetPlayerId);
          if (!game) {
            callback({
              success: false,
              errorMessage: "Failed to remove player",
            });
            return;
          }
        }

        io.to(game.id).emit("game-updated", game);
      } else {
        callback({ success: false, errorMessage: "Game not found" });
      }
    }
  );
};
