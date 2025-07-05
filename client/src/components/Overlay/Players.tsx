import { useGameStore } from "../../store/useGameStore";
import { usePlayerStore } from "../../store/usePlayerStore";

const Players = () => {
  const players = useGameStore((state) => state.players);
  const currentPlayerId = usePlayerStore((state) => state.playerId);

  // Player colors - using a variety of border colors
  const playerColors = [
    "border-red-500",
    "border-blue-500",
    "border-green-500",
    "border-yellow-500",
    "border-purple-500",
    "border-pink-500",
    "border-indigo-500",
    "border-orange-500",
  ];

  return (
    <div className="side-panel overlay-item">
      <h3 className="text-red-400 font-bold text-center tracking-wider border-b border-red-900/50 pb-2 mb-3 font-mono">
        PLAYERS
      </h3>
      <div className="space-y-3">
        {players.map((player, index) => {
          const isCurrentTurn = player.id === currentPlayerId;
          const colorClass = playerColors[index % playerColors.length];

          return (
            <div
              key={player.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all duration-300 ${
                isCurrentTurn
                  ? "bg-red-900/20 shadow-lg shadow-red-900/50"
                  : "bg-black/20"
              }`}
            >
              {/* Player Avatar Circle */}
              <div
                className={`w-10 h-10 rounded-full bg-stone-600 border-3 flex items-center justify-center font-bold text-white transition-all duration-300 ${colorClass} ${
                  isCurrentTurn
                    ? "scale-110 shadow-lg animate-pulse"
                    : "scale-100"
                }`}
              >
                <span className="text-sm font-mono">
                  {player.name.substring(0, 2).toUpperCase()}
                </span>
              </div>

              {/* Player Name */}
              <div className="flex-1">
                <div
                  className={`font-bold text-sm transition-colors duration-300 ${
                    isCurrentTurn ? "text-red-300" : "text-stone-300"
                  }`}
                >
                  {player.name}
                </div>
                {isCurrentTurn && (
                  <div className="text-xs text-red-400 font-mono animate-pulse">
                    ACTIVE TURN
                  </div>
                )}
              </div>

              {/* Turn Indicator */}
              {isCurrentTurn && (
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50"></div>
              )}
            </div>
          );
        })}

        {/* Empty state */}
        {players.length === 0 && (
          <div className="text-center text-stone-500 py-4 font-mono">
            No players in game
          </div>
        )}
      </div>
    </div>
  );
};

export default Players;
