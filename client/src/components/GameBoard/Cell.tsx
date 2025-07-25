import type {
  Cell,
  Door,
  SocketResponse,
  Zone,
} from "../../../../shared/types";
import { useCurrentPlayer } from "../../hooks/useCurrentPlayer";
import { useHandleError } from "../../hooks/useHandleError";
import { useZoneDetails } from "../../hooks/useZoneDetails";
import { getSocket } from "../../socket";
import { useGameStore } from "../../store/useGameStore";
import { usePlayerStore } from "../../store/usePlayerStore";
import DoorComponent from "./Door";
import NoiseToken from "./NoiseToken";
import ObjectiveToken from "./ObjectiveToken";
import UnitTokens from "./UnitTokens";
import ZombieSpawnToken from "./ZombieSpawnToken";

type CellProps = {
  cell: Cell;
  zone: Zone | undefined;
  door: Door | undefined;
};

const Cell: React.FC<CellProps> = ({ cell, zone, door }) => {
  const socket = getSocket();
  const handleError = useHandleError();

  const setSelectedZone = usePlayerStore((state) => state.setSelectedZone);
  const panMode = usePlayerStore((state) => state.panMode);
  const selectedCardForRanged = usePlayerStore(
    (state) => state.selectedCardForRanged
  );

  const gameId = useGameStore((state) => state.gameId);

  const { hDoubleZone, vDoubleZone, canMoveIntoZone, isRangedAttackZone } =
    useZoneDetails(zone, cell);

  const { currentPlayer, canPerformAction } = useCurrentPlayer();

  const handleClick = () => {
    if (zone && !panMode && !canMoveIntoZone) {
      setSelectedZone(zone);
    }
    if (canMoveIntoZone) {
      socket.emit(
        "move-player-to-zone",
        {
          gameId: gameId,
          playerId: currentPlayer?.id ?? "",
          fromZoneId: currentPlayer?.currentZoneId,
          toZoneId: zone?.id,
        },
        (response: SocketResponse) => {
          if (!response.success) {
            handleError(response?.error);
            return;
          }
        }
      );
    } else if (isRangedAttackZone) {
      socket.emit(
        "ranged-attack",
        {
          gameId: gameId,
          playerId: currentPlayer?.id ?? "",
          cardId: selectedCardForRanged?.id,
          zoneId: zone?.id,
        },
        (response: SocketResponse) => {
          if (!response.success) {
            handleError(response?.error);
            return;
          }
        }
      );
    }
  };

  // This is to get the correct looking pulse animation with margin and border radius
  const movableZoneClass = canMoveIntoZone ? "movable-zone" : "";
  const rangedAttackZoneClass = isRangedAttackZone ? "ranged-attack-zone" : "";
  const singleZoneClass =
    (canMoveIntoZone || isRangedAttackZone) && !hDoubleZone && !vDoubleZone
      ? "single-zone"
      : "";
  const hDoubleZoneClassLeft =
    hDoubleZone && cell.id.includes(zone?.id.split("/")[0] ?? "")
      ? "h-double-zone-left"
      : "";
  const hDoubleZoneClassRight =
    hDoubleZone && cell.id.includes(zone?.id.split("/")[1] ?? "")
      ? "h-double-zone-right"
      : "";
  const vDoubleZoneClassTop =
    vDoubleZone && cell.id.includes(zone?.id.split("/")[0] ?? "")
      ? "v-double-zone-top"
      : "";
  const vDoubleZoneClassBottom =
    vDoubleZone && cell.id.includes(zone?.id.split("/")[1] ?? "")
      ? "v-double-zone-bottom"
      : "";

  if (!zone) return null;

  return (
    <div
      key={cell.id}
      className={`grid-cell ${movableZoneClass} ${singleZoneClass} ${hDoubleZoneClassLeft} ${hDoubleZoneClassRight} ${vDoubleZoneClassTop} ${vDoubleZoneClassBottom} ${rangedAttackZoneClass}`}
      onClick={handleClick}
    >
      {door ? (
        <DoorComponent
          door={door}
          cellId={cell.id}
          currentPlayer={currentPlayer}
          canPerformAction={canPerformAction}
        />
      ) : null}
      <UnitTokens cell={cell} zone={zone} />

      {Array.from({ length: zone?.noiseTokens ?? 0 }).map((_, index) => (
        <NoiseToken
          key={index}
          index={index}
          doubleZone={
            (hDoubleZone || vDoubleZone) &&
            cell.id.includes(zone?.id.split("/")[1] ?? "")
          }
        />
      ))}

      {zone.hasZombieSpawn && <ZombieSpawnToken />}
      {zone.hasObjectiveToken && <ObjectiveToken />}
    </div>
  );
};

export default Cell;
