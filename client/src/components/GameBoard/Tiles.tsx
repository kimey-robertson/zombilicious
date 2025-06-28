import Tile from "./Tile";
import { tutorialMap } from "../../../../server/maps";

const Tiles = () => {
  const chosenMap = tutorialMap;
  return (
    <div>
      {chosenMap.tiles.map((tile) => (
        <Tile key={tile.id} tile={tile} zones={chosenMap.zones} />
      ))}
    </div>
  );
};

export default Tiles;
