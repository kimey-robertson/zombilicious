import DevModeSwitch from "../DevMode/DevModeSwitch";
import DevPanel from "../DevMode/DevPanel";
import { useDevStore } from "../../store/useDevStore";

const DevMode = () => {
  const devMode = useDevStore((state) => state.devMode);

  return (
    <div className="dev-mode-wrapper">
      {import.meta.env.DEV ? <DevModeSwitch /> : null}
      {devMode ? <DevPanel /> : null}
    </div>
  );
};

export default DevMode;
