import DevModeSwitch from "../DevMode/DevModeSwitch";
import DevPanel from "../DevMode/DevPanel";
import { usePlayerStore } from "../../store/usePlayerStore";

const DevMode = () => {
  const devMode = usePlayerStore((state) => state.devMode);

  return (
    <div className="dev-mode-wrapper">
      {import.meta.env.DEV ? <DevModeSwitch /> : null}
      {devMode ? <DevPanel /> : null}
    </div>
  );
};

export default DevMode;
