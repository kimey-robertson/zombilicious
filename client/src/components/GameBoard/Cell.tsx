import type {
  Cell,
  Door,
  Player,
  SocketResponse,
  Zone,
} from "../../../../shared/types";
import { useHandleError } from "../../hooks/useHandleError";
import { getSocket } from "../../socket";
import { useGameStore } from "../../store/useGameStore";
import { usePlayerStore } from "../../store/usePlayerStore";
import DoorComponent from "./Door";
import { isHorizontalDoubleZone, isVerticalDoubleZone } from "./gameBoardUtils";
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
  const playerId = usePlayerStore((state) => state.playerId);
  const selectedAction = usePlayerStore((state) => state.selectedAction);
  const actionsRemaining = usePlayerStore((state) => state.actionsRemaining);
  const isMyTurn = usePlayerStore((state) => state.isMyTurn);

  const players = useGameStore((state) => state.players);
  const map = useGameStore((state) => state.map);
  const gameId = useGameStore((state) => state.gameId);

  const currentPlayer = players.find((player) => player.id === playerId);

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

  const tokensToShow = playersInZone.filter((player) =>
    showPlayerToken(player)
  );

  const isMovableZone = currentPlayer?.movableZones.find(
    (movableZone) => movableZone.id === zone?.id
  );

  const canMove =
    isMovableZone &&
    selectedAction?.id === "move" &&
    actionsRemaining > 0 &&
    isMyTurn;

  const handleClick = () => {
    if (zone && !panMode) {
      setSelectedZone(zone);
    }
    if (canMove) {
      socket.emit(
        "move-player-to-zone",
        {
          gameId: gameId,
          playerId: playerId,
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
      {door ? <DoorComponent door={door} cellId={cell.id} /> : null}
      {tokensToShow.map((player, index) => (
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
          totalTokens={tokensToShow.length}
        />
      ))}
    </div>
  );
};

export default Cell;
