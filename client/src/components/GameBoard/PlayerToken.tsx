import { Player } from "../../../../shared/types";
import { getPlayerColor } from "../Overlay/overlayUtils";

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
  if (!player) return null;

  // Will probably move this to a util file later to be used for zombie tokens too
  // Calculate positioning for multiple tokens
  const getTokenTransform = () => {
    // Base transform values
    let baseX = 120;
    let baseY = 100;

    // Handle double zone positioning first
    if (isHorizontalDoubleZone) {
      baseX = 300; // Move further right for horizontal double zones
    } else if (isVerticalDoubleZone) {
      baseY = 300; // Move further down for vertical double zones
    }

    // Add small offset for multiple tokens (only if more than 1)
    if (totalTokens > 1) {
      const offsetAmount = 50; // Small offset in percentage for transform

      if (totalTokens === 2) {
        // Side by side positioning
        const offsetX = index === 0 ? -offsetAmount : offsetAmount;
        baseX = baseX + offsetX;
      } else if (totalTokens === 3) {
        // Triangle formation with small offsets
        const positions = [
          { x: 0, y: -offsetAmount }, // Top
          { x: -offsetAmount * 0.7, y: offsetAmount * 0.5 }, // Bottom left
          { x: offsetAmount * 0.7, y: offsetAmount * 0.5 }, // Bottom right
        ];
        const pos = positions[index % 3];
        baseX = baseX + pos.x;
        baseY = baseY + pos.y;
      } else {
        // Circular formation for 4+ tokens
        const offsetAngle = (index / totalTokens) * 360;
        const offsetRadius = offsetAmount;
        const offsetX = Math.cos((offsetAngle * Math.PI) / 180) * offsetRadius;
        const offsetY = Math.sin((offsetAngle * Math.PI) / 180) * offsetRadius;

        baseX = baseX + offsetX;
        baseY = baseY + offsetY;
      }
    }

    return `translate(${baseX}%, ${baseY}%)`;
  };

  return (
    <div
      className={`absolute w-10 h-10 rounded-full bg-stone-600 border-3 flex items-center justify-center font-bold text-white transition-all duration-300 ${getPlayerColor(
        player.id
      )}`}
      style={{
        transform: getTokenTransform(),
      }}
    >
      {player.name.slice(0, 2).toLocaleUpperCase()}
    </div>
  );
};

export default PlayerToken;
