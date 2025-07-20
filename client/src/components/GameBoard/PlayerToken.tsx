import { Player } from "../../../../shared/types";
import { getPlayerColor } from "../Overlay/overlayUtils";
import { getTokenTransform } from "./gameBoardUtils";

type PlayerTokenProps = {
  player: Player | undefined;
  isHorizontalDoubleZone: boolean;
  isVerticalDoubleZone: boolean;
  index?: number;
  totalTokens?: number;
};

const PlayerToken = ({
  player,
  isHorizontalDoubleZone,
  isVerticalDoubleZone,
  index = 0,
  totalTokens = 1,
}: PlayerTokenProps) => {
  if (!player || !player.alive) return null;

  return (
    <div
      className={`absolute w-10 h-10 rounded-full bg-stone-600 border-3 flex items-center justify-center font-bold text-white transition-all duration-300 ${getPlayerColor(
        player.id
      )}`}
      style={{
        transform: getTokenTransform(
          isHorizontalDoubleZone,
          isVerticalDoubleZone,
          totalTokens,
          index
        ),
        zIndex: "20",
      }}
    >
      {player.name.slice(0, 2).toLocaleUpperCase()}
    </div>
  );
};

export default PlayerToken;
