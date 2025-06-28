import { usePlayerStore } from "../../store/usePlayerStore";
import DevMode from "./DevMode";
import ResetBoard from "./ResetBoard";

const Header = () => {
  const panMode = usePlayerStore((state) => state.panMode);

  return (
    <div className="header-wrapper overlay-item">
      <ResetBoard />
      {panMode ? <div className="header-pan-mode">Pan Mode</div> : null}
      {import.meta.env.DEV ? <DevMode /> : null}
      <div className="header-title">Zombilicious</div>
    </div>
  );
};

export default Header;
