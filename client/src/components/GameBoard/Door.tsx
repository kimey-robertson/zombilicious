import { Door, Player, SocketResponse } from "../../../../shared/types";
import { useHandleError } from "../../hooks/useHandleError";
import { getSocket } from "../../socket";
import { useGameStore } from "../../store/useGameStore";
import { usePlayerStore } from "../../store/usePlayerStore";

const DoorComponent = ({
  door,
  cellId,
  currentPlayer,
  canPerformAction,
}: {
  door: Door;
  cellId: string;
  currentPlayer: Player | undefined;
  canPerformAction: boolean;
}) => {
  const socket = getSocket();
  const handleError = useHandleError();

  const gameId = useGameStore((state) => state.gameId);

  const playerId = usePlayerStore((state) => state.playerId);
  const selectedAction = usePlayerStore((state) => state.selectedAction);

  const isCurrentPlayerNextToDoor =
    currentPlayer?.currentZoneId.includes(door.cellIds[0]) ||
    currentPlayer?.currentZoneId.includes(door.cellIds[1]);

  const handleDoorClick = () => {
    if (
      selectedAction?.id === "door" &&
      isCurrentPlayerNextToDoor &&
      door.state === "closed" &&
      currentPlayer?.playerCards?.inHand.some((card) => card.canOpenDoors) &&
      canPerformAction
    ) {
      socket.emit(
        "open-door",
        {
          gameId,
          playerId,
          doorId: door.id,
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

  if (door.cellIds[1] !== cellId) return null;

  return (
    <div
      className={`door-container ${door.state}`}
      onClick={handleDoorClick}
      style={{
        transform: door.transform,
      }}
    >
      <div className="door-frame">
        <div className="door-panel">
          <div className="door-handle"></div>
          <div className="door-details">
            <div className="door-panel-line top"></div>
            <div className="door-panel-line bottom"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoorComponent;
