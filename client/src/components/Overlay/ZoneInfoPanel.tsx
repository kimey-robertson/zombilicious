import React from "react";
import { usePlayerStore } from "../../store/usePlayerStore";

const ZoneInfoPanel: React.FC = () => {
  const selectedZone = usePlayerStore((state) => state.selectedZone);
  const devMode = usePlayerStore((state) => state.devMode);
  if (!selectedZone) return null;
  return (
    <div className="zone-info-panel">
      <h3>Selected Zone: {selectedZone.id}</h3>
      <div className="zone-detail">
        🧟 Zombies:
        {/* <span>{zoneInfo.zombies}</span> */}
      </div>
      <div className="zone-detail">
        🧑 Survivors:
        {/* <span>{zoneInfo.survivors}</span> */}
      </div>
      <div className="zone-detail">
        🔊 Noise:
        {/* <span>{zoneInfo.noise}</span> */}
      </div>
      {devMode ? (
        <>
          <div>
            Cell Ids: {selectedZone.cellIds.map((cellId) => cellId).join(", ")}
          </div>
          <div>Is a room: {selectedZone.room.toString()}</div>
          <div>
            Tile ids: {selectedZone.tileIds.map((tileId) => tileId).join(", ")}
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ZoneInfoPanel;
