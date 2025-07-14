import { Map, Zone } from "../../shared/types";
import { OperationFailedError } from "../utils/socketErrors";

// Helper function to calculate global coordinates for a cell
function getGlobalCoordinates(cellId: string, map: Map) {
  const tile = map.tiles.find((tile) =>
    tile.cells.some((cell) => cell.id === cellId)
  );
  const cell = tile?.cells.find((cell) => cell.id === cellId);

  if (!cell || !tile) return null;

  return {
    row: tile.position.y * 3 + cell.row,
    col: tile.position.x * 3 + cell.col,
  };
}

// Helper function to check if there's an open door connecting two zones
function isDoorBetweenZones(zone1: Zone, zone2: Zone, map: Map): boolean {
  // Find doors that connect cells from both zones
  for (const door of map.doors) {
    const zone1CellsInDoor = zone1.cellIds.filter((cellId) =>
      door.cellIds.includes(cellId)
    );
    const zone2CellsInDoor = zone2.cellIds.filter((cellId) =>
      door.cellIds.includes(cellId)
    );

    // If the door connects cells from both zones AND is open, movement is allowed
    if (
      zone1CellsInDoor.length > 0 &&
      zone2CellsInDoor.length > 0 &&
      door.state === "open"
    ) {
      return true;
    }
  }

  return false;
}

// Helper function to check if two zones are adjacent and passable
function areZonesAdjacent(zone1: Zone, zone2: Zone, map: Map): boolean {
  // Get all global coordinates for cells in both zones
  const zone1Coords = zone1.cellIds
    .map((cellId) => getGlobalCoordinates(cellId, map))
    .filter((coord) => coord !== null);

  const zone2Coords = zone2.cellIds
    .map((cellId) => getGlobalCoordinates(cellId, map))
    .filter((coord) => coord !== null);

  // Check if any cell in zone1 is adjacent to any cell in zone2
  let physicallyAdjacent = false;
  for (const coord1 of zone1Coords) {
    for (const coord2 of zone2Coords) {
      // Two cells are adjacent if they differ by exactly 1 in either row or col (but not both)
      const rowDiff = Math.abs(coord1.row - coord2.row);
      const colDiff = Math.abs(coord1.col - coord2.col);

      // Adjacent means exactly one coordinate differs by 1, the other by 0
      if (
        (rowDiff === 1 && colDiff === 0) ||
        (rowDiff === 0 && colDiff === 1)
      ) {
        physicallyAdjacent = true;
        break;
      }
    }
    if (physicallyAdjacent) break;
  }

  // If zones aren't physically adjacent, can't move between them
  if (!physicallyAdjacent) {
    return false;
  }

  // Check room/door constraints
  const zone1IsRoom = zone1.room;
  const zone2IsRoom = zone2.room;

  // If both zones are rooms or both are non-rooms, no door required
  if (zone1IsRoom === zone2IsRoom) {
    return true;
  }

  // If one is a room and the other isn't, there must be a door between them
  return isDoorBetweenZones(zone1, zone2, map);
}

export function calculateMovableZones(map: Map, currentZoneId: string): Zone[] {
  const movableZones: Zone[] = [];

  // Find the current zone object
  const currentZoneObj = getZoneFromId(currentZoneId, map);

  // Check all other zones for adjacency
  for (const zone of map.zones) {
    // Skip the current zone
    if (zone.id === currentZoneId) continue;

    // Check if this zone is adjacent to the current zone
    if (areZonesAdjacent(currentZoneObj, zone, map)) {
      movableZones.push(zone);
    }
  }

  return movableZones;
}

function getZoneFromId(zoneId: string, map: Map): Zone {
  const foundZone = map.zones.find((zone) => zone.id === zoneId);
  if (!foundZone) {
    throw new OperationFailedError("Get zone from id", {
      message: `Cannot find zone with id: ${zoneId}`,
    });
  }
  return foundZone;
}

function hasLineOfSight(
  direction: "up" | "down" | "left" | "right",
  zombieZone: Zone,
  playerZone: Zone
) {
  let lineOfSight = false;
}

function getZoneDirection(
  fromZone: Zone,
  toZone: Zone,
  map: Map
): "up" | "down" | "left" | "right" | undefined {
  if (!fromZone || !toZone || !map || fromZone.id === toZone.id) return;
  const fromZoneCoords: { row: number; col: number }[] = [];
  fromZone.cellIds.forEach((cellId) => {
    const coords = getGlobalCoordinates(cellId, map);
    if (!coords) return;
    return fromZoneCoords.push(coords);
  });
  const toZoneCoords: { row: number; col: number }[] = [];
  toZone.cellIds.forEach((cellId) => {
    const coords = getGlobalCoordinates(cellId, map);
    if (!coords) return;
    return toZoneCoords.push(coords);
  });

  console.log({ fromZoneCoords, toZoneCoords });

  // If any of the cols are the same, it's a vertical movement
  if (
    fromZoneCoords[0].col === toZoneCoords[0].col ||
    fromZoneCoords[1].col === toZoneCoords[0].col ||
    fromZoneCoords[0].col === toZoneCoords[1].col
  ) {
    const maxFromRow = Math.max(...fromZoneCoords.map((zone) => zone.row));
    const maxToRow = Math.max(...toZoneCoords.map((zone) => zone.row));
    if (maxFromRow > maxToRow) {
      return "up";
    } else if (maxFromRow < maxToRow) {
      return "down";
    }
  } else if (
    // If any of the rows are the same, it's a horizontal movement
    fromZoneCoords[0].row === toZoneCoords[0].row ||
    fromZoneCoords[1].row === toZoneCoords[0].row ||
    fromZoneCoords[0].row === toZoneCoords[1].row
  ) {
    const maxFromCol = Math.max(...fromZoneCoords.map((zone) => zone.col));
    const maxToCol = Math.max(...toZoneCoords.map((zone) => zone.col));
    if (maxFromCol > maxToCol) {
      return "left";
    } else if (maxFromCol < maxToCol) {
      return "right";
    }
  }
}

export function calculateZombieMovement(
  zombieZone: Zone,
  map: Map,
  playerZonesIds: string[]
) {
  if (!zombieZone.zombies) return;

  // const initialMovableZones = calculateMovableZones(map, zombieZone.id);

  const direction = getZoneDirection(
    zombieZone,
    getZoneFromId(playerZonesIds[0], map),
    map
  );
  console.log("direction:", direction);
  // const coords0 = getGlobalCoordinates(zone.cellIds[0], map);
  // const coords1 = getGlobalCoordinates(zone.cellIds[1], map);
  // const playerZones = playerZonesIds.map((id) => getZoneFromId(id, map));
  // let playerCoords0;
  // let playerCoords1;
  // if (playerZones && playerZones[0]) {
  //   playerCoords0 = getGlobalCoordinates(playerZones[0].cellIds[0], map);
  //   playerCoords1 = getGlobalCoordinates(playerZones[0].cellIds[1], map);
  // }

  // console.log("coords0", coords0);
  // console.log("coords1", coords1);
  // console.log("playerCoords0", playerCoords0);
  // console.log("playerCoords1", playerCoords1);
}
