import type { Cell, Door, Zone } from "../../../../shared/types";
import { usePlayerStore } from "../../store/usePlayerStore";
import DoorComponent from "./Door";

type CellProps = {
  cell: Cell;
  zone: Zone | undefined;
  door: Door | undefined;
};

const Cell: React.FC<CellProps> = ({ cell, zone, door }) => {
  const setSelectedZone = usePlayerStore((state) => state.setSelectedZone);
  const panMode = usePlayerStore((state) => state.panMode);

  const handleClick = () => {
    if (zone && !panMode) {
      setSelectedZone(zone);
    }
  };
  return (
    <div key={cell.id} className="grid-cell" onClick={handleClick}>
      {door ? <DoorComponent door={door} cellId={cell.id} /> : null}
    </div>
  );
};

export default Cell;
