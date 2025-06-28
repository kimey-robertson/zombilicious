import { usePlayerStore } from "../../store/usePlayerStore";

import { MdCenterFocusWeak } from "react-icons/md";

const ResetBoard = () => {
  const reset = usePlayerStore((state) => state.reset);
    
  return (
    <div className="flex items-center gap-2">
      <MdCenterFocusWeak onClick={reset} size={48} className="cursor-pointer" />
    </div>
  );
};

export default ResetBoard;
