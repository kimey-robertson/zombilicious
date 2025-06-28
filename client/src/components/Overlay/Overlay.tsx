import { usePlayerStore } from "../../store/usePlayerStore";
import Header from "./Header";
import RightSidebar from "./RightSideBar";

const Overlay = () => {
  const isDragging = usePlayerStore((state) => state.isDragging);
  return (
    <div className={`overlay-wrapper ${isDragging ? "overlay-dragging" : ""}`}>
      <Header />
      <RightSidebar />
    </div>
  );
};

export default Overlay;
