import "./App.css";
import Home from "./components/Home/Home";
// import GameWrapper from "./components/GameWrapper";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div>
      <Toaster position="top-right" />
      <Home />
      {/* <GameWrapper /> */}
    </div>
  );
}

export default App;
