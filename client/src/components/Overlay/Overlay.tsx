import { usePlayerStore } from "../../store/usePlayerStore";
import Header from "./Header";
import RightSidebar from "./RightSidebar";
import "./Overlay.css";

const Overlay = () => {
  const isDragging = usePlayerStore((state) => state.isDragging);
  const hideOverlay = usePlayerStore((state) => state.hideOverlay);

  const conditionalClasses = [
    isDragging ? "overlay-dragging" : "",
    hideOverlay ? "hidden" : "",
  ];

  return (
    <div className={`overlay-wrapper ${conditionalClasses.join(" ")}`}>
      <Header />
      <RightSidebar />
    </div>
  );
};

export default Overlay;
