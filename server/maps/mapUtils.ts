import { Map, Zone } from "../../shared/types";

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

// Helper function to check if there's a door connecting two zones
function isDoorBetweenZones(zone1: Zone, zone2: Zone, map: Map): boolean {
  // Find doors that connect cells from both zones
  for (const door of map.doors) {
    const zone1CellsInDoor = zone1.cellIds.filter((cellId) =>
      door.cellIds.includes(cellId)
    );
    const zone2CellsInDoor = zone2.cellIds.filter((cellId) =>
      door.cellIds.includes(cellId)
    );

    // If the door connects cells from both zones, there's a door between them
    if (zone1CellsInDoor.length > 0 && zone2CellsInDoor.length > 0) {
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

export function calculateMovableZones(map: Map, currentZone: string): Zone[] {
  const movableZones: Zone[] = [];

  // Find the current zone object
  const currentZoneObj = map.zones.find((zone) => zone.id === currentZone);
  if (!currentZoneObj) {
    console.log("Current zone not found:", currentZone);
    return movableZones;
  }

  // Check all other zones for adjacency
  for (const zone of map.zones) {
    // Skip the current zone
    if (zone.id === currentZone) continue;

    // Check if this zone is adjacent to the current zone
    if (areZonesAdjacent(currentZoneObj, zone, map)) {
      movableZones.push(zone);
    }
  }

  return movableZones;
}
