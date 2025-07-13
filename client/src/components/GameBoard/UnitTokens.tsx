import React from "react";
import { Cell, Zone } from "../../../../shared/types";
import ZombieToken from "./ZombieToken";
import PlayerToken from "./PlayerToken";
import { useZoneDetails } from "../../hooks/useZoneDetails";

type UnitTokensProps = {
  cell: Cell;
  zone: Zone;
};

const UnitTokens: React.FC<UnitTokensProps> = ({ cell, zone }) => {
  const { hDoubleZone, vDoubleZone, playerTokensInZone, zombieTokensInZone } =
    useZoneDetails(zone, cell);

  const cellIdIsInZone = cell.id.includes(zone?.id.split("/")[0] ?? "");
  const isHorizontalDoubleZone = hDoubleZone && cellIdIsInZone;
  const isVerticalDoubleZone = vDoubleZone && cellIdIsInZone;
  const totalTokens = playerTokensInZone.length + zombieTokensInZone;

  return (
    <>
      {playerTokensInZone.map((player, index) => (
        <PlayerToken
          key={player.id}
          player={player}
          isHorizontalDoubleZone={isHorizontalDoubleZone}
          isVerticalDoubleZone={isVerticalDoubleZone}
          index={index}
          totalTokens={totalTokens}
        />
      ))}
      {Array.from({ length: zombieTokensInZone }).map((_, index) => (
        <ZombieToken
          key={index}
          isHorizontalDoubleZone={isHorizontalDoubleZone}
          isVerticalDoubleZone={isVerticalDoubleZone}
          index={index}
          totalTokens={totalTokens}
        />
      ))}
    </>
  );
};

export default UnitTokens;
