import { usePlayerStore } from "../../store/usePlayerStore";
import ResetBoard from "./ResetBoard";
import RotateBoard from "./RotateBoard";
import "./Header.css";

const Header = () => {
  const panMode = usePlayerStore((state) => state.panMode);

  return (
    <div className="header-wrapper overlay-item">
      <ResetBoard />
      <RotateBoard />
      {panMode ? <div className="header-pan-mode">Pan Mode</div> : null}
      <div className="zombilicious user-select-none">Zombilicious</div>
    </div>
  );
};

export default Header;
