import "./App.css";
import Home from "./components/Home/Home";
// import GameWrapper from "./components/GameWrapper";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <>
      <Toaster position="top-right" />
      <Home />
      {/* <GameWrapper /> */}
    </>
  );
}

export default App;
