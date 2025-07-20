import "./App.css";
import Home from "./components/Home/Home";
import { Toaster } from "react-hot-toast";
import { useGameSockets } from "./hooks/useGameSockets";
import { useGameStore } from "./store/useGameStore";
import GameWrapper from "./components/GameWrapper";
import DevMode from "./components/DevMode/DevMode";
import GameOverPopup from "./components/Overlay/GameOverPopup";

function App() {
  useGameSockets();

  const gameId = useGameStore((state) => state.gameId);

  return (
    <>
      <Toaster position="top-right" />
      <DevMode />
      {gameId ? <GameWrapper /> : <Home />}
      <GameOverPopup />

    </>
  );
}

export default App;
