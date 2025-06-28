import TileComponent from "./Tile";
import { tutorialMap } from "../../../../server/maps";

const Tiles = () => {
  const map = tutorialMap;
  return (
    <div>
      {map.tiles.map((tile) => (
        <TileComponent key={tile.id} tile={tile} zones={map.zones} />
      ))}
    </div>
  );
};

export default Tiles;
