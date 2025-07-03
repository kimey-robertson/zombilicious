import { useLobbyStore } from "../../store/useLobbyStore";

const ReconnectToGamePopup = () => {
  const reconnectableGames = useLobbyStore((state) => state.reconnectableGames);
  const gameToConnectTo = reconnectableGames.find(
    (game) => game.playerId === localStorage.getItem("playerId")
  )?.game;

  if (reconnectableGames.length === 0 || !gameToConnectTo) {
    return null;
  }

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
          minWidth: "400px",
          maxWidth: "500px",
          textAlign: "center",
          boxShadow:
            "0 0 20px rgba(0, 0, 0, 0.8), 0 0 40px rgba(139, 0, 0, 0.3)",
          border: "2px solid var(--primary-color)",
          fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
        }}
      >
        {/* Header */}
        <div
          style={{
            fontSize: "2rem",
            fontWeight: "600",
            color: "var(--primary-color)",
            marginBottom: "1rem",
            filter: "drop-shadow(0 4px 4px rgba(0, 0, 0, 0.5))",
          }}
        >
          🔄 Reconnect to Game
        </div>

        {/* Game Info */}
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
            Game Details
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              textAlign: "left",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.5rem 0",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Game Name:
              </span>
              <span
                style={{ color: "var(--secondary-color)", fontWeight: "600" }}
              >
                {gameToConnectTo.name ?? "Zombilicious Game"}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.5rem 0",
                borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>
                Players:
              </span>
              <span style={{ color: "rgba(255, 255, 255, 0.9)" }}>
                {gameToConnectTo.players.length}/4 Active
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "0.5rem 0",
              }}
            >
              <span style={{ color: "rgba(255, 255, 255, 0.7)" }}>Status:</span>
              <span
                style={{
                  color: "#4ade80",
                  fontWeight: "600",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <span style={{ fontSize: "0.8rem" }}>●</span> Game in Progress
              </span>
            </div>
          </div>
        </div>

        {/* Message */}
        <p
          style={{
            fontSize: "1.1rem",
            marginBottom: "2rem",
            color: "rgba(255, 255, 255, 0.8)",
            lineHeight: "1.5",
          }}
        >
          Your previous game session was detected.
          <br />
          <strong style={{ color: "var(--secondary-color)" }}>
            Rejoin the undead battle!
          </strong>
        </p>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "1rem",
            justifyContent: "center",
            marginBottom: "1rem",
          }}
        >
          <button
            style={{
              padding: "0.75rem 2rem",
              fontSize: "1rem",
              fontWeight: "600",
              borderRadius: "0.5rem",
              border: "none",
              background: "var(--primary-color)",
              color: "white",
              cursor: "pointer",
              transition: "all 0.2s",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.3)",
              filter: "drop-shadow(0 0 4px rgba(139, 0, 0, 0.4))",
            }}
          >
            🎮 Reconnect
          </button>
          <button
            style={{
              padding: "0.75rem 1.5rem",
              fontSize: "1rem",
              fontWeight: "600",
              borderRadius: "0.5rem",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              background: "transparent",
              color: "rgba(255, 255, 255, 0.8)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Cancel
          </button>
        </div>

        {/* Footer */}
        <div
          style={{
            fontSize: "0.8rem",
            color: "rgba(255, 255, 255, 0.5)",
            fontStyle: "italic",
          }}
        >
          The horde awaits your return... 🧟‍♂️
        </div>
      </div>
    </div>
  );
};

export default ReconnectToGamePopup;
