const NoiseToken = () => {
  return (
    <div
      className="noise-token"
      style={{
        position: "absolute",
        transform: "translate(50%, 50%)",
        zIndex: 50,
        pointerEvents: "none",
      }}
    >
      <div
        className="triangle-body"
        style={{
          width: 0,
          height: 0,
          borderLeft: "15px solid transparent",
          borderRight: "15px solid transparent",
          borderBottom: "26px solid #ffdd00",
          position: "relative",
          filter: "drop-shadow(0 1px 2px rgba(0, 0, 0, 0.8))",
        }}
      >
        {/* Inner black triangle */}
        <div
          style={{
            position: "absolute",
            top: "4px",
            left: "-11px",
            width: 0,
            height: 0,
            borderLeft: "11px solid transparent",
            borderRight: "11px solid transparent",
            borderBottom: "18px solid #1a1a1a",
            zIndex: 1,
          }}
        />

        <div
          className="volume-symbol"
          style={{
            position: "absolute",
            top: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            fontSize: "12px",
            fontWeight: "bold",
            color: "#ffdd00",
            textShadow: "0 1px 1px rgba(0, 0, 0, 0.8)",
            zIndex: 2,
          }}
        >
          <span>🔊</span>
        </div>
      </div>
    </div>
  );
};

export default NoiseToken;
