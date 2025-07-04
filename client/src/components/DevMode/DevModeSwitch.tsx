import { useDevStore } from "../../store/useDevStore";
import Switch from "../UI/Switch";

const DevModeSwitch = () => {
  const devMode = useDevStore((state) => state.devMode);
  const setDevMode = useDevStore((state) => state.setDevMode);
  return (
    <div className="dev-mode-switch overlay-item">
      <h3>Dev mode:</h3> <Switch onChange={() => setDevMode(!devMode)} />
    </div>
  );
};

export default DevModeSwitch;
