import type { Cell, Door, Zone } from "../../../../shared/types";
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
  const setSelectedZone = usePlayerStore((state) => state.setSelectedZone);
  const panMode = usePlayerStore((state) => state.panMode);
  const players = useGameStore((state) => state.players);
  const map = useGameStore((state) => state.map);

  const playerInZone = players.find((player) =>
    player.currentZone.includes(zone?.id ?? "")
  );

  const hDoubleZone = isHorizontalDoubleZone(zone, map);
  const vDoubleZone = isVerticalDoubleZone(zone, map);


  const showPlayerToken =
    hDoubleZone || vDoubleZone
      ? playerInZone && cell.id.includes(zone?.id.split("/")[0] ?? "")
      : playerInZone;

  const handleClick = () => {
    if (zone && !panMode) {
      setSelectedZone(zone);
    }
  };

  return (
    <div key={cell.id} className="grid-cell" onClick={handleClick}>
      {door ? <DoorComponent door={door} cellId={cell.id} /> : null}
      {showPlayerToken ? (
        <PlayerToken
          player={playerInZone}
          showHorizontalDoubleZoneToken={
            hDoubleZone && cell.id.includes(zone?.id.split("/")[0] ?? "")
          }
          showVerticalDoubleZoneToken={
            vDoubleZone && cell.id.includes(zone?.id.split("/")[0] ?? "")
          }
        />
      ) : null}
    </div>
  );
};

export default Cell;
