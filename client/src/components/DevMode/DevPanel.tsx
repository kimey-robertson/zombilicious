import { usePlayerStore } from "../../store/usePlayerStore";
import Switch from "../UI/Switch";

const DevPanel = () => {
  const hideOverlay = usePlayerStore((state) => state.hideOverlay);
  const setHideOverlay = usePlayerStore((state) => state.setHideOverlay);
  return (
    <div className="side-panel overlay-item">
      <h3>Dev mode panel</h3>
      <div className="side-panel-detail">
        Hide overlay: <Switch onChange={() => setHideOverlay(!hideOverlay)} />
      </div>
      <div className="side-panel-detail"></div>
      <div className="side-panel-detail"></div>
    </div>
  );
};

export default DevPanel;
