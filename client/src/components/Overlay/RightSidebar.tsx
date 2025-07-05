import ZoneInfoPanel from "./ZoneInfoPanel";
import Players from "./Players";

const RightSidebar = () => {
  return (
    <div className="right-side-bar">
      <ZoneInfoPanel />
      <div className="mt-4">
        <Players />
      </div>
    </div>
  );
};

export default RightSidebar;
