import { getTokenTransform } from "./gameBoardUtils";

type ZombieTokenProps = {
  isHorizontalDoubleZone: boolean;
  isVerticalDoubleZone: boolean;
  index?: number;
  totalTokens?: number;
};
const ZombieToken: React.FC<ZombieTokenProps> = ({
  isHorizontalDoubleZone,
  isVerticalDoubleZone,
  index = 0,
  totalTokens = 1,
}) => {
  return (
    <div
      className={`absolute w-10 h-10 rounded-full bg-stone-600 border-3 flex items-center justify-center font-bold text-white transition-all duration-300`}
      style={{
        transform: getTokenTransform(
          isHorizontalDoubleZone,
          isVerticalDoubleZone,
          totalTokens,
          index + 10 // Should be whatever the max players is
        ),
      }}
    >
      Z
    </div>
  );
};

export default ZombieToken;
