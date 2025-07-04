import { usePlayerStore } from "../../store/usePlayerStore";
import Header from "./Header";
import RightSidebar from "./RightSidebar";
import "./Overlay.css";
import Footer from "./Footer";
import LeftSidebar from "./LefttSidebar";
import { useDevStore } from "../../store/useDevStore";

const Overlay = () => {
  const isDragging = usePlayerStore((state) => state.isDragging);
  const hideOverlay = useDevStore((state) => state.hideOverlay);

  const conditionalClasses = [
    isDragging ? "overlay-dragging" : "",
    hideOverlay ? "hidden" : "",
  ];

  return (
    <div className={`overlay-wrapper ${conditionalClasses.join(" ")}`}>
      <Header />
      <LeftSidebar />
      <RightSidebar />
      <Footer />
    </div>
  );
};

export default Overlay;
