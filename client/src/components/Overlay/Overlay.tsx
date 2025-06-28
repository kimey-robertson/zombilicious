import { usePlayerStore } from "../../store/usePlayerStore";
import ResetBoard from "./ResetBoard";

const Overlay = () => {
  const isDragging = usePlayerStore((state) => state.isDragging);
  return (
    <div className="overlay-wrapper">
      <div className={`overlay ${isDragging ? "overlay-dragging" : ""}`}>
        <ResetBoard />
      </div>
    </div>
  );
};

export default Overlay;
