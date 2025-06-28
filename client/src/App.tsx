import "./App.css";
import GameBoard from "./components/GameBoard/GameBoard";
import KeyboardListener from "./components/KeyboardListener";
import Overlay from "./components/Overlay/Overlay";

function App() {
  return (
    <div>
      <GameBoard />
      <Overlay />
      <KeyboardListener />
    </div>
  );
}

export default App;
