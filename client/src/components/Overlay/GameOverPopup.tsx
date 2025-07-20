import { useGameStore } from "../../store/useGameStore";

const GameOverPopup = () => {
  const status = useGameStore((state) => state.status);

  // Only show popup when game status is "lost"
  if (status !== "lost") return null;

  const handleReturnToHome = () => {
    // Reset game state and return to home screen
    window.location.reload(); // Simple way to reset everything and go back to home
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        height: "100vh",
        width: "100vw",
        background: "rgba(0, 0, 0, 0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        style={{
          background: "#1c1c1c",
          color: "rgba(255, 255, 255, 0.87)",
          padding: "3rem",
          borderRadius: "1rem",
          minWidth: "500px",
          maxWidth: "600px",
          textAlign: "center",
          boxShadow:
            "0 0 30px rgba(0, 0, 0, 0.9), 0 0 60px rgba(139, 0, 0, 0.4), 0 0 100px rgba(139, 0, 0, 0.2)",
          border: "3px solid var(--primary-color)",
          fontFamily: "system-ui, Avenir, Helvetica, Arial, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Animated background effect */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 30%, rgba(139, 0, 0, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(139, 0, 0, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(139, 0, 0, 0.08) 0%, transparent 50%)
            `,
            animation: "flicker 3s ease-in-out infinite alternate",
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <div
          style={{
            fontSize: "3rem",
            fontWeight: "700",
            color: "var(--primary-color)",
            marginBottom: "1rem",
            filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.7))",
            textShadow: "0 0 20px rgba(139, 0, 0, 0.6)",
            position: "relative",
            zIndex: 1,
          }}
        >
          💀 GAME OVER 💀
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: "1.4rem",
            fontWeight: "600",
            color: "#ef4444",
            marginBottom: "2rem",
            fontFamily: "monospace",
            letterSpacing: "0.1em",
            position: "relative",
            zIndex: 1,
          }}
        >
          THE UNDEAD HAVE PREVAILED
        </div>

        {/* Death Message */}
        <div
          style={{
            background: "rgba(139, 0, 0, 0.15)",
            border: "2px solid rgba(139, 0, 0, 0.4)",
            borderRadius: "0.75rem",
            padding: "2rem",
            marginBottom: "2rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: "1.3rem",
              color: "rgba(255, 255, 255, 0.9)",
              marginBottom: "1rem",
              lineHeight: "1.4",
            }}
          >
            🧟‍♂️{" "}
            <strong style={{ color: "var(--secondary-color)" }}>
              All survivors have fallen
            </strong>{" "}
            🧟‍♀️
          </div>
          <div
            style={{
              fontSize: "1rem",
              color: "rgba(255, 255, 255, 0.7)",
              fontStyle: "italic",
            }}
          >
            The zombie horde has consumed the last of humanity...
            <br />
            Your brave resistance has come to an end.
          </div>
        </div>

        {/* Epitaph */}
        <div
          style={{
            fontSize: "0.9rem",
            color: "rgba(255, 255, 255, 0.6)",
            fontStyle: "italic",
            marginBottom: "2.5rem",
            padding: "1rem",
            background: "rgba(0, 0, 0, 0.2)",
            borderRadius: "0.5rem",
            borderLeft: "4px solid var(--primary-color)",
            position: "relative",
            zIndex: 1,
          }}
        >
          "In the end, it wasn't the lack of bullets that doomed us...
          <br />
          It was the endless hunger of the undead."
          <br />
          <br />
          <em>— Final transmission from the last survivor</em>
        </div>

        {/* Return Button */}
        <button
          style={{
            padding: "1rem 3rem",
            fontSize: "1.2rem",
            fontWeight: "700",
            borderRadius: "0.75rem",
            border: "2px solid var(--primary-color)",
            background:
              "linear-gradient(145deg, var(--primary-color), #6b0000)",
            color: "white",
            cursor: "pointer",
            transition: "all 0.3s ease",
            boxShadow:
              "0 4px 8px rgba(0, 0, 0, 0.4), 0 0 20px rgba(139, 0, 0, 0.3)",
            filter: "drop-shadow(0 0 8px rgba(139, 0, 0, 0.5))",
            fontFamily: "monospace",
            letterSpacing: "0.05em",
            position: "relative",
            zIndex: 1,
            textShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
          }}
          onClick={handleReturnToHome}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "scale(1.05)";
            e.currentTarget.style.boxShadow =
              "0 6px 12px rgba(0, 0, 0, 0.5), 0 0 30px rgba(139, 0, 0, 0.5)";
            e.currentTarget.style.background =
              "linear-gradient(145deg, #a00000, var(--primary-color))";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "scale(1)";
            e.currentTarget.style.boxShadow =
              "0 4px 8px rgba(0, 0, 0, 0.4), 0 0 20px rgba(139, 0, 0, 0.3)";
            e.currentTarget.style.background =
              "linear-gradient(145deg, var(--primary-color), #6b0000)";
          }}
        >
          🏠 RETURN TO SAFETY
        </button>

        {/* Footer */}
        <div
          style={{
            fontSize: "0.8rem",
            color: "rgba(255, 255, 255, 0.4)",
            fontStyle: "italic",
            marginTop: "2rem",
            position: "relative",
            zIndex: 1,
          }}
        >
          Will you dare to face the horde again? 🧟‍♂️🧟‍♀️
        </div>

        {/* CSS Animations */}
        <style>
          {`
            @keyframes flicker {
              0%, 100% { opacity: 0.8; }
              25% { opacity: 0.9; }
              50% { opacity: 0.7; }
              75% { opacity: 0.95; }
            }
          `}
        </style>
      </div>
    </div>
  );
};

export default GameOverPopup;
