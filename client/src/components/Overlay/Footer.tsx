import { useEffect, useState } from "react";
import { usePlayerStore } from "../../store/usePlayerStore";
import "./Footer.css";
import XPTracker from "./XPTracker";
import ActionsRemaining from "./ActionsRemaining";
import PlayerCards from "./PlayerCards";
import ActionButtons from "./ActionButtons";

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isDragging = usePlayerStore((state) => state.isDragging);

  useEffect(() => {
    if (isDragging) {
      setIsOpen(false);
    }
  }, [isDragging]);

  return (
    <>
      {/* Toggle */}
      <div className="footer-toggle">
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "Hide Action Panel" : "Show Action Panel"}
        </button>
      </div>
      {/* // Panel */}
      <div className={`footer-panel ${isOpen ? "open" : "closed"}`}>
        <XPTracker />
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <ActionsRemaining />
          <PlayerCards />
          <ActionButtons />
        </div>
        {/* <div className="footer-panel-content">
            <h2>Action Panel</h2>
            <div className="footer-panel-actions">
                <button>Action 1</button>
                <button>Action 2</button>
                <button>Action 3</button>
            </div>
            </div> */}
      </div>
    </>
  );
};

export default Footer;
