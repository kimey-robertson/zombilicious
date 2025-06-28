import { usePlayerStore } from "../../store/usePlayerStore";
import Header from "./Header";

const Overlay = () => {
  const isDragging = usePlayerStore((state) => state.isDragging);
  return (
    <div className={`overlay-wrapper ${isDragging ? "overlay-dragging" : ""}`}>
      <Header />
    </div>
  );
};

export default Overlay;
