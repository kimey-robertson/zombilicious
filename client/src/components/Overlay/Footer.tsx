import { useEffect, useState } from "react";
import { usePlayerStore } from "../../store/usePlayerStore";
import "./Footer.css";
import XPTracker from "./XPTracker";
import ActionsRemaining from "./ActionsRemaining";
import PlayerCards from "./PlayerCards";
import ActionButtons from "./ActionButtons";
import { Button } from "../UI/Button";

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
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-b from-red-900/90 to-black/95 border-2 border-red-700/60 text-red-200 hover:from-red-800/90 hover:to-red-950/95 hover:border-red-600/80 shadow-xl font-mono"
        >
          {isOpen ? "Hide Action Panel" : "Show Action Panel"}
        </Button>
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
