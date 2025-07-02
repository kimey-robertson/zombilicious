import { useEffect, useRef } from "react";
import { getSocket } from "../socket";
import { Game } from "../../../shared/types";
import { useGameStore } from "../store/useGameStore";

export const useGameSockets = () => {
  const socketRef = useRef(getSocket());
  const socket = socketRef.current;

  const setGames = useGameStore((state) => state.setGames);

  const handleGameCreated = (game: Game) => {
    console.log("game created", game);
    setGames((prevGames) => [...prevGames, game]);

  };

  useEffect(() => {
    socket.on("game-created", handleGameCreated);
    return () => {
      socket.off("game-created", handleGameCreated);
    };
  });
};
