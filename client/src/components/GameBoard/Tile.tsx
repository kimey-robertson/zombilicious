import { useState, useEffect } from "react";
import type { Tile, Zone } from "../../../../shared/types";
import Cell from "./Cell";

type TileProps = {
  tile: Tile;
  zones: Zone[];
};

const Tile = ({ tile, zones }: TileProps) => {
  const [tileImage, setTileImage] = useState<string>("");

  useEffect(() => {
    const loadTileImage = async () => {
      try {
        // Using tile-${tile.id}.jpg to match file names
        const imageModule = await import(`../../assets/tile-${tile.id}.jpg`);
        setTileImage(imageModule.default);
      } catch (error) {
        console.error(`Failed to load tile image for ${tile.id}:`, error);
      }
    };

    loadTileImage();
  }, [tile.id]);

  if (!tileImage) {
    return <div className="game-board-tile loading">Loading tile...</div>;
  }

  return (
    <div className="game-board-tile">
      <img
        src={tileImage}
        alt="tile"
        className="tile-image"
        style={{ transform: `rotate(${tile.rotation}deg)` }}
      />
      <div className="tile-grid-overlay">
        {tile.cells.map((cell) => (
          <Cell
            key={cell.id}
            cell={cell}
            zone={zones.find((zone) => zone.cellIds.includes(cell.id))}
          />
        ))}
      </div>
    </div>
  );
};

export default Tile;
