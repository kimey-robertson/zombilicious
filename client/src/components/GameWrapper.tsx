import GameBoard from "./GameBoard/GameBoard";
import Overlay from "./Overlay/Overlay";
import KeyboardListener from "./KeyboardListener";
import PlayerDisconnectedPopup from "./Overlay/PlayerDisconnectedPopup";

const GameWrapper = () => {
  return (
    <>
      <GameBoard />
      <Overlay />
      <KeyboardListener />
      <PlayerDisconnectedPopup />
    </>
  );
};

export default GameWrapper;
