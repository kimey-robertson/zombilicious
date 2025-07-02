import { useEffect, useRef } from "react";
import { getSocket } from "../socket";
import { Game } from "../../../shared/types";
import { useGameStore } from "../store/useGameStore";

export const useGameSockets = () => {
  const socketRef = useRef(getSocket());
  const socket = socketRef.current;

  const setGameId = useGameStore((state) => state.setGameId);

  const handleGameCreated = (game: Game) => {
    console.log("game created", game);
    setGameId(game.id);
  };

  useEffect(() => {
    socket.on("game-created", handleGameCreated);
    return () => {
      socket.off("game-created", handleGameCreated);
    };
  });
};
