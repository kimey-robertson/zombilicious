import type { Cell, Zone } from "../../../../shared/types";
import { usePlayerStore } from "../../store/usePlayerStore";

type CellProps = {
  cell: Cell;
  zone: Zone | undefined;
};

const Cell: React.FC<CellProps> = ({ cell, zone }) => {
  const { setSelectedZone } = usePlayerStore();

  const handleClick = () => {
    if (zone) {
      setSelectedZone(zone);
    }
  };
  return (
    <div key={cell.id} className="grid-cell" onClick={handleClick}>
      <div></div>
    </div>
  );
};

export default Cell;
