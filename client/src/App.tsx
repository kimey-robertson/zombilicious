import "./App.css";
import Home from "./components/Home/Home";
// import GameWrapper from "./components/GameWrapper";
import { Toaster } from "react-hot-toast";
import { useGameSockets } from "./hooks/useGameSockets";
import { useGameStore } from "./store/useGameStore";
import GameWrapper from "./components/GameWrapper";
import DevMode from "./components/DevMode/DevMode";

function App() {
  useGameSockets();

  const gameId = useGameStore((state) => state.gameId);

  return (
    <>
      <Toaster position="top-right" />
      <DevMode />

      {gameId ? <GameWrapper /> : <Home />}
    </>
  );
}

export default App;
