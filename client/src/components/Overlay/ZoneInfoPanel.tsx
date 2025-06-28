import React from "react";

type ZoneInfo = {
  id: string;
  zombies: number;
  survivors: number;
  noise: number;
};

const ZoneInfoPanel: React.FC<{ zoneInfo: ZoneInfo }> = ({ zoneInfo }) => {
  if (!zoneInfo) return null;
  return (
    <div className="zone-info-panel">
      <h3>{zoneInfo.id}</h3>
      <div className="zone-detail">
        🧟 Zombies: <span>{zoneInfo.zombies}</span>
      </div>
      <div className="zone-detail">
        🧑 Survivors: <span>{zoneInfo.survivors}</span>
      </div>
      <div className="zone-detail">
        🔊 Noise: <span>{zoneInfo.noise}</span>
      </div>
    </div>
  );
};

export default ZoneInfoPanel;
