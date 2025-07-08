import { Map, Zone } from "../../../../shared/types";

// Check if zone is a horizontal double zone (2 cells side by side)
export const isHorizontalDoubleZone = (
  zone: Zone | undefined,
  map: Map | undefined
) => {
  if (!zone || zone.cellIds.length !== 2 || !map || !("tiles" in map)) {
    return false;
  }

  // Find the two cells in this zone with their tile information
  const zoneCellsWithTiles = zone.cellIds
    .map((cellId) => {
      const tile = map.tiles.find((tile) =>
        tile.cells.some((cell) => cell.id === cellId)
      );
      const cell = tile?.cells.find((cell) => cell.id === cellId);
      return cell && tile ? { cell, tile } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (zoneCellsWithTiles.length !== 2) {
    return false;
  }

  // Calculate global coordinates for each cell
  const [item1, item2] = zoneCellsWithTiles;
  const globalRow1 = item1.tile.position.y * 3 + item1.cell.row;
  const globalCol1 = item1.tile.position.x * 3 + item1.cell.col;
  const globalRow2 = item2.tile.position.y * 3 + item2.cell.row;
  const globalCol2 = item2.tile.position.x * 3 + item2.cell.col;

  // Check if they are horizontally adjacent (same row, consecutive columns)
  const sameRow = globalRow1 === globalRow2;
  const consecutiveCols = Math.abs(globalCol1 - globalCol2) === 1;

  return sameRow && consecutiveCols;
};

// Check if zone is a vertical double zone (2 cells stacked vertically)
export const isVerticalDoubleZone = (
  zone: Zone | undefined,
  map: Map | undefined
) => {
  if (!zone || zone.cellIds.length !== 2 || !map || !("tiles" in map)) {
    return false;
  }

  // Find the two cells in this zone with their tile information
  const zoneCellsWithTiles = zone.cellIds
    .map((cellId) => {
      const tile = map.tiles.find((tile) =>
        tile.cells.some((cell) => cell.id === cellId)
      );
      const cell = tile?.cells.find((cell) => cell.id === cellId);
      return cell && tile ? { cell, tile } : null;
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  if (zoneCellsWithTiles.length !== 2) {
    return false;
  }

  // Calculate global coordinates for each cell
  const [item1, item2] = zoneCellsWithTiles;
  const globalRow1 = item1.tile.position.y * 3 + item1.cell.row;
  const globalCol1 = item1.tile.position.x * 3 + item1.cell.col;
  const globalRow2 = item2.tile.position.y * 3 + item2.cell.row;
  const globalCol2 = item2.tile.position.x * 3 + item2.cell.col;

  // Check if they are vertically adjacent (same column, consecutive rows)
  const sameCol = globalCol1 === globalCol2;
  const consecutiveRows = Math.abs(globalRow1 - globalRow2) === 1;

  return sameCol && consecutiveRows;
};
