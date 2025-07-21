import { Button } from "../UI/Button";
import { FaSearch } from "react-icons/fa";
import { IoMdMove } from "react-icons/io";
import { FaDoorOpen } from "react-icons/fa";
import { FiPackage } from "react-icons/fi";
import { LuAxe } from "react-icons/lu";
import { GiSawedOffShotgun } from "react-icons/gi";
import { FaRegHand } from "react-icons/fa6";
import { BsVolumeUp } from "react-icons/bs";
import { IconType } from "react-icons/lib";
import { usePlayerStore } from "../../store/usePlayerStore";
import { ActionType } from "../../../../shared/types";
import { useActionButtons } from "../../hooks/useActionButtons";

export type GameAction = {
  id: ActionType;
  icon: IconType;
  label: string;
};

const ActionButtons = () => {
  const gameActions: GameAction[] = [
    { id: "search", icon: FaSearch, label: "Search" },
    { id: "move", icon: IoMdMove, label: "Move" },
    { id: "door", icon: FaDoorOpen, label: "Open Door" },
    { id: "inventory", icon: FiPackage, label: "Inventory" },
    { id: "melee", icon: LuAxe, label: "Melee" },
    { id: "ranged", icon: GiSawedOffShotgun, label: "Ranged" },
    { id: "objective", icon: FaRegHand, label: "Take Objective" },
    { id: "noise", icon: BsVolumeUp, label: "Make Noise" },
  ];

  const selectedAction = usePlayerStore((state) => state.selectedAction);
  const { buttonDisabled, handleActionButtonClick } = useActionButtons();

  return (
    <div className="space-y-4">
      <h4 className="text-red-400 font-bold text-center tracking-wider border-b border-red-900/50 pb-2 font-mono">
        ACTIONS
      </h4>
      <div className="grid grid-cols-2 gap-2">
        {gameActions.map((action) => {
          const IconComponent = action.icon;
          const isButtonDisabled = buttonDisabled(action.id);
          return (
            <Button
              key={action.id}
              onClick={() => handleActionButtonClick(action)}
              disabled={isButtonDisabled}
              className={`bg-gradient-to-b text-stone-200 p-3 h-auto flex flex-col items-center gap-2 transition-all duration-300 border-2 shadow-lg relative overflow-hidden font-mono ${
                selectedAction?.id === action.id && !isButtonDisabled
                  ? "border-red-400/80 shadow-red-900/50 bg-gradient-to-b from-red-800/90 to-red-950/90"
                  : ""
              } ${
                isButtonDisabled
                  ? "opacity-30 cursor-not-allowed grayscale"
                  : "hover:scale-105 hover:shadow-xl"
              }`}
            >
              <IconComponent size={18} className="drop-shadow-sm" />
              <span className="text-xs font-semibold text-center leading-tight tracking-wide">
                {action.label}
              </span>
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default ActionButtons;
