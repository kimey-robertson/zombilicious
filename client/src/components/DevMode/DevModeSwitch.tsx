import { usePlayerStore } from "../../store/usePlayerStore";
import Switch from "../UI/Switch";

const DevModeSwitch = () => {
  const devMode = usePlayerStore((state) => state.devMode);
  const setDevMode = usePlayerStore((state) => state.setDevMode);
  return (
    <div className="dev-mode-switch overlay-item">
      <h3>Dev mode:</h3> <Switch onChange={() => setDevMode(!devMode)} />
    </div>
  );
};

export default DevModeSwitch;
