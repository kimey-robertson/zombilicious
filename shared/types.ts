type Tile = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  cells: Cell[];
};

type Cell = {
  id: string;
  tileId: string;
  row: number;
  col: number;
};

type Zone = {
  id: string;
  cellIds: string[];
  tileIds: string[];
}
