import GameBoard from "./GameBoard/GameBoard";
import Overlay from "./Overlay/Overlay";
import KeyboardListener from "./KeyboardListener";
import DevMode from "./DevMode/DevMode";

const GameWrapper = () => {
  return (
    <>
      <GameBoard />
      <Overlay />
      <KeyboardListener />
      <DevMode />
    </>
  );
};

export default GameWrapper;
