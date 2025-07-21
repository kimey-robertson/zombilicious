const ObjectiveToken = () => {
  return (
    <div className="objective-token">
      {/* Outer glow ring */}
      <div className="objective-glow-ring" />

      {/* Main cross container */}
      <div className="objective-cross-container">
        {/* Vertical bar of cross */}
        <div className="objective-cross-vertical" />

        {/* Horizontal bar of cross */}
        <div className="objective-cross-horizontal" />

        {/* Center circle */}
        <div className="objective-center-circle" />

        {/* Center dot */}
        <div className="objective-center-dot" />

        {/* Corner markers for tactical look */}
        <div className="objective-corner-marker" />
        <div className="objective-corner-marker" />
        <div className="objective-corner-marker" />
        <div className="objective-corner-marker" />
      </div>
    </div>
  );
};

export default ObjectiveToken;
