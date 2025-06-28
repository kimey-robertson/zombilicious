import { usePlayerStore } from "../../store/usePlayerStore";
import DevPanel from "./DevPanel";
import ZoneInfoPanel from "./ZoneInfoPanel";

const RightSidebar = () => {
  const devMode = usePlayerStore((state) => state.devMode);
  return (
    <div className="right-side-bar">
      <ZoneInfoPanel />
      {devMode ? <DevPanel /> : null}
    </div>
  );
};

export default RightSidebar;
