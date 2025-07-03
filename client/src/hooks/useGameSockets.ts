import { useEffect, useRef } from "react";
import { getSocket } from "../socket";
import { Game } from "../../../shared/types";
import { useGameStore } from "../store/useGameStore";
import { usePlayerStore } from "../store/usePlayerStore";

export const useGameSockets = () => {
  const socketRef = useRef(getSocket());
  const socket = socketRef.current;

  const resetGame = usePlayerStore((state) => state.resetGame);
  const resetBoardPosition = usePlayerStore(
    (state) => state.resetBoardPosition
  );

  const setGameId = useGameStore((state) => state.setGameId);
  const setPlayers = useGameStore((state) => state.setPlayers);
  const setStatus = useGameStore((state) => state.setStatus);
  const setDisconnectedPlayers = useGameStore(
    (state) => state.setDisconnectedPlayers
  );

  const handleGameCreated = (game: Game) => {
    console.log("game created", game);
    setGameId(game.id);
    setPlayers(game.players);
    setStatus(game.status);
    resetGame();
    resetBoardPosition();
  };

  const handleGameUpdated = (game: Game) => {
    console.log("game updated", game);
    setPlayers(game.players);
    setStatus(game.status);
    setDisconnectedPlayers(game.disconnectedPlayers);
  };

  useEffect(() => {
    socket.on("game-created", handleGameCreated);
    socket.on("game-updated", handleGameUpdated);
    return () => {
      socket.off("game-created", handleGameCreated);
      socket.off("game-updated", handleGameUpdated);
    };
  });
};
