import { useGameStore } from "../store/useGameStore";
import { usePlayerStore } from "../store/usePlayerStore";

export const useCurrentPlayer = () => {
  const players = useGameStore((state) => state.players);
  const map = useGameStore((state) => state.map);

  const playerId = usePlayerStore((state) => state.playerId);
  const actionsRemaining = usePlayerStore((state) => state.actionsRemaining);
  const isMyTurn = usePlayerStore((state) => state.isMyTurn);

  const currentPlayer = players.find((player) => player.id === playerId);

  const canPerformAction = actionsRemaining > 0 && isMyTurn;

  const currentZone = map.zones.find(
    (zone) => zone.id === currentPlayer?.currentZoneId
  );

  return { currentPlayer, canPerformAction, currentZone };
};
