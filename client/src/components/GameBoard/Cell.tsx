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
import PlayerToken from "./PlayerToken";

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
  const selectedAction = usePlayerStore((state) => state.selectedAction);

  const gameId = useGameStore((state) => state.gameId);

  const { hDoubleZone, vDoubleZone, playerTokensToShow, isMovableZone } =
    useZoneDetails(zone, cell);

  const { currentPlayer, canPerformAction } = useCurrentPlayer();

  const canMove =
    isMovableZone && selectedAction?.id === "move" && canPerformAction;

  const handleClick = () => {
    if (zone && !panMode && !canMove) {
      setSelectedZone(zone);
    }
    if (canMove) {
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
    }
  };

  return (
    <div
      key={cell.id}
      className={`grid-cell ${canMove ? "movable-zone" : ""}`}
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
      {playerTokensToShow.map((player, index) => (
        <PlayerToken
          key={player.id}
          player={player}
          isHorizontalDoubleZone={
            hDoubleZone && cell.id.includes(zone?.id.split("/")[0] ?? "")
          }
          isVerticalDoubleZone={
            vDoubleZone && cell.id.includes(zone?.id.split("/")[0] ?? "")
          }
          index={index}
          totalTokens={playerTokensToShow.length}
        />
      ))}
    </div>
  );
};

export default Cell;
