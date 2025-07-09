import { useState } from "react";
import { Door } from "../../../../shared/types";
import { usePlayerStore } from "../../store/usePlayerStore";

const DoorComponent = ({ door, cellId }: { door: Door; cellId: string }) => {
  const selectedAction = usePlayerStore((state) => state.selectedAction);
  const [isOpen, setIsOpen] = useState(false);

  const handleDoorClick = () => {
    if (selectedAction?.id === "door") {
      console.log("door clicked");
      setIsOpen(!isOpen);
    }
  };

  if (door.cellIds[1] !== cellId) return null;

  return (
    <div
      className={`door-container ${isOpen ? "open" : "closed"}`}
      onClick={handleDoorClick}
      style={{
        transform: door.transform,
      }}
    >
      <div className="door-frame">
        <div className="door-panel">
          <div className="door-handle"></div>
          <div className="door-details">
            <div className="door-panel-line top"></div>
            <div className="door-panel-line bottom"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoorComponent;
