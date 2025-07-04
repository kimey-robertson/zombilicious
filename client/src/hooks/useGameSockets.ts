import { useEffect, useRef } from "react";
import { getSocket } from "../socket";
import { Game, LogEvent } from "../../../shared/types";
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
  const setDisconnectTimers = useGameStore(
    (state) => state.setDisconnectTimers
  );
  const setGameLogs = useGameStore((state) => state.setGameLogs);

  const playerId = usePlayerStore((state) => state.playerId);

  const handleGameCreated = (game: Game) => {
    console.log("game created", game);
    setGameId(game.id);
    setPlayers(game.players);
    setStatus(game.status);
    setGameLogs(game.gameLogs);
    resetGame();
    resetBoardPosition();
    localStorage.setItem("playerId", playerId || socket.id || "");
  };

  const handleGameUpdated = (game: Game) => {
    console.log("game updated", game);
    setPlayers(game.players);
    setStatus(game.status);
    setDisconnectedPlayers(game.disconnectedPlayers);
  };

  const handleUpdateDisconnectTimer = ({
    time,
    playerId,
  }: {
    time: string;
    playerId: string;
  }) => {
    setDisconnectTimers((prev) => ({ ...prev, [playerId]: time }));
  };

  const handleLogEvent = (logEvent: LogEvent) => {
    setGameLogs((prev) => [...prev, logEvent]);
  };

  useEffect(() => {
    socket.on("game-created", handleGameCreated);
    socket.on("game-updated", handleGameUpdated);
    socket.on("updated-disconnect-timer", handleUpdateDisconnectTimer);
    socket.on("log-event", handleLogEvent);
    return () => {
      socket.off("game-created", handleGameCreated);
      socket.off("game-updated", handleGameUpdated);
      socket.off("updated-disconnect-timer", handleUpdateDisconnectTimer);
      socket.off("log-event", handleLogEvent);
    };
  });
};
