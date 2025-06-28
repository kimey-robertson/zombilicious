import { Cell } from "../shared/types";

function getTileCells(tileId: string) {
  const cells: Cell[] = [];
  for (let i = 0; i < 9; i++) {
    cells.push({
      id: `${tileId}-${i}`,
      tileId,
      row: Math.floor(i / 3),
      col: i % 3,
    });
  }
  return cells;
}

export { getTileCells };
