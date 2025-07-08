import { Player } from "../../../../shared/types";

type PlayerTokenProps = {
  player: Player | undefined;
  showHorizontalDoubleZoneToken: boolean;
};

const PlayerToken = ({
  player,
  showHorizontalDoubleZoneToken,
}: PlayerTokenProps) => {
  if (!player) return null;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div
        className="w-10 h-10 rounded-full bg-stone-600 border-3 flex items-center justify-center font-bold text-white transition-all duration-300 border-red-500"
        style={{
          transform: showHorizontalDoubleZoneToken
            ? "translateX(180%)"
            : "",
        }}
      >
        {player.name.slice(0, 2).toLocaleUpperCase()}
      </div>
    </div>
  );
};

export default PlayerToken;
