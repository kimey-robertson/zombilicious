import "./App.css";
import DevMode from "./components/DevMode/DevMode";
import GameBoard from "./components/GameBoard/GameBoard";
import KeyboardListener from "./components/KeyboardListener";
import Overlay from "./components/Overlay/Overlay";

function App() {
  return (
    <div>
      <GameBoard />
      <Overlay />
      <KeyboardListener />
      <DevMode />
    </div>
  );
}

export default App;
