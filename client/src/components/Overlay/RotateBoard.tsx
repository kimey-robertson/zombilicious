import { FaArrowRotateRight } from "react-icons/fa6";
import { usePlayerStore } from "../../store/usePlayerStore";

const RotateBoard = () => {
  const setRotation = usePlayerStore((state) => state.setRotation);

  return (
    <div className="flex items-center mx-2">
      <FaArrowRotateRight
        size={36}
        className="cursor-pointer"
        onClick={() => setRotation((prev) => prev + 90)}
      />
    </div>
  );
};

export default RotateBoard;
