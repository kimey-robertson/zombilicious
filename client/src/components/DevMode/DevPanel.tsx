import { useDevStore } from "../../store/useDevStore";
import Switch from "../UI/Switch";

const DevPanel = () => {
  const hideOverlay = useDevStore((state) => state.hideOverlay);
  const setHideOverlay = useDevStore((state) => state.setHideOverlay);
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
