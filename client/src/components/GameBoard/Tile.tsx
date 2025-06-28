import { useState, useEffect } from "react";
import type { Tile } from "../../../../shared/types";

type TileProps = {
  tile: Tile;
};

const TileComponent = ({ tile }: TileProps) => {
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
      <img src={tileImage} alt="tile" className="tile-image" />
      <div className="tile-grid-overlay">
        {Array.from({ length: 9 }, (_, index) => (
          <div key={index} className="grid-cell">
            <div className="grid-cell-inner"></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TileComponent;
