import { usePlayerStore } from "../../store/usePlayerStore";

import { MdCenterFocusWeak } from "react-icons/md";

const ResetBoard = () => {
  const resetBoardPosition = usePlayerStore(
    (state) => state.resetBoardPosition
  );

  return (
    <div className="flex items-center gap-2">
      <MdCenterFocusWeak
        onClick={resetBoardPosition}
        size={48}
        className="cursor-pointer"
      />
    </div>
  );
};

export default ResetBoard;
