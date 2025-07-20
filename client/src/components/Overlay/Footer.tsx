import { useEffect, useState } from "react";
import { usePlayerStore } from "../../store/usePlayerStore";
import "./Footer.css";
import XPTracker from "./XPTracker";
import ActionsRemaining from "./ActionsRemaining";
import PlayerCards from "./PlayerCards";
import ActionButtons from "./ActionButtons";
import { Button } from "../UI/Button";
import { useCurrentPlayer } from "../../hooks/useCurrentPlayer";
import { getSocket } from "../../socket";
import { useGameStore } from "../../store/useGameStore";
import { SocketResponse } from "../../../../shared/types";
import { useHandleError } from "../../hooks/useHandleError";

const Footer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isDragging = usePlayerStore((state) => state.isDragging);
  const gameId = useGameStore((state) => state.gameId);

  const socket = getSocket();
  const handleError = useHandleError();
  const { currentPlayer } = useCurrentPlayer();

  useEffect(() => {
    if (isDragging) {
      setIsOpen(false);
    }
  }, [isDragging]);

  const handleLeaveGame = () => {
    socket.emit(
      "dead-player-leave-game",
      {
        gameId: gameId,
        playerId: currentPlayer?.id,
      },
      (response: SocketResponse) => {
        if (!response.success) {
          handleError(response.error);
        } else {
          window.location.reload();
        }
      }
    );
  };

  return (
    <>
      {/* Toggle */}
      <div className="footer-toggle">
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="overlay-item bg-gradient-to-b from-red-900/90 to-black/95 border-2 border-red-700/60 text-red-200 hover:from-red-800/90 hover:to-red-950/95 hover:border-red-600/80 shadow-xl font-mono"
        >
          {isOpen ? "Hide Action Panel" : "Show Action Panel"}
        </Button>
      </div>
      {/* // Panel */}
      <div className={`footer-panel ${isOpen ? "open" : "closed"}`}>
        {currentPlayer?.alive ? (
          <>
            <XPTracker />
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <PlayerCards />
              <ActionsRemaining />
              <ActionButtons />
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center h-full justify-center py-8 px-6">
            <div className="text-center mb-4">
              <div className="text-4xl font-bold text-red-500 mb-2 drop-shadow-lg font-mono">
                💀 YOU ARE DEAD 💀
              </div>
              <div className="text-lg text-red-300 font-mono tracking-wider">
                The undead have claimed another victim...
              </div>
            </div>
            <div className="bg-gradient-to-b from-red-900/20 to-black/40 border border-red-700/50 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-red-200 text-sm font-mono text-center opacity-80">
                Your story ends here, but the horde continues...
              </div>
            </div>
            <Button onClick={handleLeaveGame} className="mt-4">
              Leave Game
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default Footer;
