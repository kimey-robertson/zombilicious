import Tile from "./Tile";
import { useGameStore } from "../../store/useGameStore";
import { Map } from "../../../../shared/types";

const Tiles = () => {
  const chosenMap = useGameStore((state) => state.map) as Map;

  if (!chosenMap || Object.keys(chosenMap).length === 0) return null;

  return (
    <>
      {chosenMap.tiles.map((tile) => (
        <Tile key={tile.id} tile={tile} zones={chosenMap.zones} />
      ))}
    </>
  );
};

export default Tiles;
