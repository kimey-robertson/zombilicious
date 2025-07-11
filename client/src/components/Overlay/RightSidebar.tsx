import ZoneInfoPanel from "./ZoneInfoPanel";
import Players from "./Players";

const RightSidebar = () => {
  return (
    <div className="right-side-bar">
      <Players />
      <ZoneInfoPanel />
    </div>
  );
};

export default RightSidebar;
