import GameBoard from "./GameBoard/GameBoard";
import Overlay from "./Overlay/Overlay";
import KeyboardListener from "./KeyboardListener";

const GameWrapper = () => {
  return (
    <>
      <GameBoard />
      <Overlay />
      <KeyboardListener />
    </>
  );
};

export default GameWrapper;
