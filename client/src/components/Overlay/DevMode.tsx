import { usePlayerStore } from "../../store/usePlayerStore";
import Switch from "../UI/Switch";

const DevMode = () => {
  const devMode = usePlayerStore((state) => state.devMode);
  const setDevMode = usePlayerStore((state) => state.setDevMode);
  return (
    <div className="header-dev-mode">
      <h3>Dev mode:</h3> <Switch onChange={() => setDevMode(!devMode)} />
    </div>
  );
};

export default DevMode;
