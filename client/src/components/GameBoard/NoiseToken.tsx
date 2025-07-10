const NoiseToken = ({
  index = 0,
  doubleZone,
}: {
  index?: number;
  doubleZone: boolean;
}) => {
  // Generate consistent but varied positioning and rotation based on index
  const getTokenVariation = () => {
    // Use index to generate consistent randomness
    const seed = index * 137.5; // Prime number for better distribution
    const offsetX = Math.sin(seed) * 15; // ±15% horizontal variation
    const offsetY = Math.cos(seed) * 15; // ±15% vertical variation
    const rotation = Math.sin(seed * 1.3) * 25; // ±25 degrees rotation
    const scaleVariation = 0.8 + Math.abs(Math.sin(seed * 0.7)) * 0.15; // 0.8 to 0.95 scale

    return {
      offsetX,
      offsetY,
      rotation,
      scaleVariation,
    };
  };

  const variation = getTokenVariation();

  if (doubleZone) {
    return null;
  }

  return (
    <div
      className="noise-token"
      style={{
        position: "absolute",
        transform: `translate(${120 + variation.offsetX}%, ${
          400 + variation.offsetY
        }%) rotate(${variation.rotation}deg)`,
        zIndex: 50 + index, // Stack tokens with different z-indices
        pointerEvents: "none",
        scale: variation.scaleVariation,
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
