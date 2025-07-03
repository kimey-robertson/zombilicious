import { toast } from "react-hot-toast";
import { getSocket } from "../../socket";
import { useGameStore } from "../../store/useGameStore";
import { usePlayerStore } from "../../store/usePlayerStore";

const PlayerDisconnectedPopup = () => {
  const socket = getSocket();

  const gameId = useGameStore((state) => state.gameId);
  const disconnectedPlayers = useGameStore(
    (state) => state.disconnectedPlayers
  );
  const players = useGameStore((state) => state.players);
  const playerId = usePlayerStore((state) => state.playerId);

  const disconnectedPlayer = Object.values(disconnectedPlayers)[0];

  const remainingPlayers = players.filter(
    (player) => player.id !== Object.keys(disconnectedPlayers)[0]
  );

  const remainingPlayersWithVotes = remainingPlayers.map((player) => {
    return {
      id: player.id,
      name: player.name,
      hasVoted: disconnectedPlayer?.kickVotes?.includes(player.id) ?? false,
      isCurrentPlayer: player.id === playerId,
    };
  });

  const votedCount = remainingPlayersWithVotes.filter((p) => p.hasVoted).length;

  const handleVoteToRemove = () => {
    console.log("vote to remove");
    socket.emit(
      "vote-kick-player-from-game",
      {
        gameId: gameId,
        targetPlayerId: Object.keys(disconnectedPlayers)[0],
        votingPlayerId: playerId,
      },
      (data: { success: boolean; errorMessage?: string }) => {
        if (!data.success) {
          toast.error(data.errorMessage ?? "Failed to vote to remove player");
        }
      }
    );
  };

  if (Object.keys(disconnectedPlayers).length === 0) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        background: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        style={{
          background: "#1c1c1c",
          color: "rgba(255, 255, 255, 0.87)",
          padding: "2rem",
          borderRadius: "0.75rem",
          minWidth: "450px",
          maxWidth: "600px",
          textAlign: "center",
          boxShadow:
            "0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 0, 0, 0.3)",
          border: "2px solid var(--primary-color)",
          fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "600",
            color: "var(--primary-color)",
            marginBottom: "1rem",
            filter: "drop-shadow(0 4px 4px rgba(0, 0, 0, 0.5))",
          }}
        >
          ⚠️ Player Disconnected!
        </div>

        <p
          style={{
            fontSize: "1.1rem",
            marginBottom: "1.5rem",
            color: "rgba(255, 255, 255, 0.8)",
            lineHeight: "1.5",
          }}
        >
          <strong style={{ color: "var(--secondary-color)" }}>
            {disconnectedPlayer?.name ?? "Unknown Player"}
          </strong>{" "}
          has left the game. You can vote them out now, or they will be removed
          in 00:00.
        </p>

        {/* Voting Section */}
        <div
          style={{
            background: "rgba(0, 0, 0, 0.3)",
            padding: "1.5rem",
            borderRadius: "0.5rem",
            marginBottom: "1.5rem",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <h3
            style={{
              color: "var(--secondary-color)",
              fontSize: "1.2rem",
              marginBottom: "1rem",
              fontWeight: "600",
            }}
          >
            Vote to Remove Player
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "0.75rem",
              marginBottom: "1rem",
            }}
          >
            {remainingPlayersWithVotes.map((player) => (
              <div
                key={player.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.5rem 0.75rem",
                  background: player.isCurrentPlayer
                    ? "rgba(139, 0, 0, 0.2)"
                    : "rgba(255, 255, 255, 0.05)",
                  borderRadius: "0.25rem",
                  border: player.isCurrentPlayer
                    ? "1px solid var(--primary-color)"
                    : "1px solid rgba(255, 255, 255, 0.1)",
                }}
              >
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: player.isCurrentPlayer
                      ? "var(--secondary-color)"
                      : "rgba(255, 255, 255, 0.9)",
                    fontWeight: player.isCurrentPlayer ? "600" : "400",
                  }}
                >
                  {player.name}
                </span>
                <span
                  style={{
                    fontSize: "1.2rem",
                    color: player.hasVoted ? "#4ade80" : "#ef4444",
                  }}
                >
                  {player.hasVoted ? "✓" : "✗"}
                </span>
              </div>
            ))}
          </div>

          <div
            style={{
              fontSize: "0.9rem",
              color: "rgba(255, 255, 255, 0.6)",
              marginBottom: "1rem",
            }}
          >
            {votedCount} of {remainingPlayersWithVotes.length} players voted to
            remove
          </div>

          <div
            style={{
              display: "flex",
              gap: "1rem",
              justifyContent: "center",
            }}
          >
            <button
              style={{
                padding: "0.75rem 1.5rem",
                fontSize: "1rem",
                fontWeight: "600",
                borderRadius: "0.5rem",
                border: "none",
                background: "var(--primary-color)",
                color: "white",
                cursor: "pointer",
                transition: "all 0.2s",
                boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              }}
              onClick={() => handleVoteToRemove()}
              disabled={
                remainingPlayersWithVotes.find((p) => p.isCurrentPlayer)
                  ?.hasVoted
              }
            >
              Vote to Remove
            </button>
          </div>
        </div>

        <div
          style={{
            fontSize: "0.8rem",
            color: "rgba(255, 255, 255, 0.5)",
            fontStyle: "italic",
          }}
        >
          The undead never rest... 🧟‍♂️
        </div>
      </div>
    </div>
  );
};

export default PlayerDisconnectedPopup;
