import tile2 from "../../assets/zombilicious_tile_1b.jpg";
import tile1 from "../../assets/zombilicious_tile_2b.jpg";

type TileProps = {
  tile: number;
};

const Tile = ({ tile }: TileProps) => {
  const tileImages = [tile1, tile2];

  return (
    <div className="game-board-tile">
      <img src={tileImages[tile]} alt="tile" className="tile-image" />
      <div className="tile-grid-overlay">
        {Array.from({ length: 9 }, (_, index) => (
          <div key={index} className="grid-cell">
            <div className="grid-cell-inner">
              {index}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tile;
