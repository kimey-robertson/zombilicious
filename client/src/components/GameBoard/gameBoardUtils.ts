import { Map, Zone } from "../../../../shared/types";

// Check if zone is a horizontal double zone (2 cells side by side)
export const isHorizontalDoubleZone = (
  zone: Zone | undefined,
  map: Map | undefined
) => {
  if (!zone || zone.cellIds.length !== 2 || !map || !("tiles" in map)) {
    return false;
  }

  // Get all cells from all tiles
  const allCells = map.tiles.flatMap((tile) => tile.cells);

  // Find the two cells in this zone
  const zoneCells = zone.cellIds
    .map((cellId) => allCells.find((cell) => cell.id === cellId))
    .filter((cell): cell is NonNullable<typeof cell> => cell !== undefined);

  if (zoneCells.length !== 2) {
    return false;
  }

  // Check if they are horizontally adjacent (same row, consecutive columns)
  const [cell1, cell2] = zoneCells;
  const sameRow = cell1.row === cell2.row;
  const consecutiveCols = Math.abs(cell1.col - cell2.col) === 1;

  return sameRow && consecutiveCols;
};
