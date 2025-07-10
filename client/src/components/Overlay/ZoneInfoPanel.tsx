import React from "react";
import { usePlayerStore } from "../../store/usePlayerStore";
import { useDevStore } from "../../store/useDevStore";
import { useGameStore } from "../../store/useGameStore";

const ZoneInfoPanel: React.FC = () => {
  const devMode = useDevStore((state) => state.devMode);

  const selectedZone = usePlayerStore((state) => state.selectedZone);

  const players = useGameStore((state) => state.players);

  if (!selectedZone) return null;

  const playersInZone = players.filter((player) =>
    player.currentZoneId.includes(selectedZone.id)
  ).length;

  return (
    <div className="side-panel overlay-item">
      <h3>Selected Zone: {selectedZone.id}</h3>
      <div className="side-panel-detail">
        🧟 Zombies:
        {/* <span>{zoneInfo.zombies}</span> */}
      </div>
      <div className="side-panel-detail">
        🧑 Survivors:
        <span>{playersInZone}</span>
      </div>
      <div className="side-panel-detail">
        🔊 Noise:
        <span>{selectedZone.noiseTokens + playersInZone}</span>
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
