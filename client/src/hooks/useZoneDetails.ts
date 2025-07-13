import { Cell, Player, Zone } from "../../../shared/types";
import {
  isHorizontalDoubleZone,
  isVerticalDoubleZone,
} from "../components/GameBoard/gameBoardUtils";
import { useGameStore } from "../store/useGameStore";
import { usePlayerStore } from "../store/usePlayerStore";
import { useCurrentPlayer } from "./useCurrentPlayer";

export const useZoneDetails = (zone: Zone | undefined, cell: Cell) => {
  const players = useGameStore((state) => state.players);
  const map = useGameStore((state) => state.map);

  const selectedAction = usePlayerStore((state) => state.selectedAction);

  const { currentPlayer, canPerformAction } = useCurrentPlayer();

  if (!zone)
    return {
      currentPlayer: undefined,
      hDoubleZone: false,
      vDoubleZone: false,
      playerTokensInZone: [],
      zombieTokensInZone: 0,
      isMovableZone: false,
    };

  const playersInZone = players.filter((player) =>
    player.currentZoneId.includes(zone?.id ?? "")
  );

  const hDoubleZone = isHorizontalDoubleZone(zone, map);
  const vDoubleZone = isVerticalDoubleZone(zone, map);

  const showPlayerToken = (player: Player) => {
    const playerInZone = playersInZone.find((p) => p.id === player.id);
    return hDoubleZone || vDoubleZone
      ? playerInZone && cell.id.includes(zone?.id.split("/")[0] ?? "")
      : playerInZone;
  };

  const playerTokensInZone = playersInZone.filter((player) =>
    showPlayerToken(player)
  );

  // Apply the same double zone filtering logic to zombie tokens
  const shouldShowZombieTokens = () => {
    if (hDoubleZone || vDoubleZone) {
      return cell.id.includes(zone?.id.split("/")[0] ?? "");
    }
    return true;
  };

  const zombieTokensInZone = shouldShowZombieTokens() ? zone?.zombies ?? 0 : 0;

  const isMovableZone = currentPlayer?.movableZones.find(
    (movableZone) => movableZone.id === zone?.id
  );

  const canMoveIntoZone =
    isMovableZone && selectedAction?.id === "move" && canPerformAction;

  return {
    hDoubleZone,
    vDoubleZone,
    playerTokensInZone,
    zombieTokensInZone,
    isMovableZone,
    canMoveIntoZone,
  };
};
