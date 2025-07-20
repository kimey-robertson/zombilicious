import { Card, GameStatus, Map, Player, Zone } from "../../shared/types";
import { OperationFailedError } from "../utils/socketErrors";
import { Queue } from "../utils/classes";

type Direction = "up" | "down" | "left" | "right";

type ZoneInfo = {
  distance: number;
  zoneId: string;
  noise: number;
};

type VisibleZonesWithPlayers = Partial<Record<Direction, ZoneInfo>>;

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
function isDoorBetweenZones(
  zone1: Zone,
  zone2: Zone,
  map: Map,
  ignoreLockedDoor: boolean = false
): boolean {
  // Find doors that connect cells from both zones
  for (const door of map.doors) {
    const zone1CellsInDoor = zone1.cellIds.filter((cellId) =>
      door.cellIds.includes(cellId)
    );
    const zone2CellsInDoor = zone2.cellIds.filter((cellId) =>
      door.cellIds.includes(cellId)
    );

    // If the door connects cells from both zones AND is open, movement is allowed

    const zonesHaveDoor =
      zone1CellsInDoor.length > 0 && zone2CellsInDoor.length > 0;
    if (
      (zonesHaveDoor && door.state === "open") ||
      (zonesHaveDoor && door.state === "closed" && ignoreLockedDoor)
    ) {
      return true;
    }
  }

  return false;
}

// Helper function to check if two zones are adjacent and passable
function areZonesAdjacent(
  zone1: Zone,
  zone2: Zone,
  map: Map,
  ignoreLockedDoor: boolean = false
): boolean {
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
  return isDoorBetweenZones(zone1, zone2, map, ignoreLockedDoor);
}

export function calculateMovableZones(
  map: Map,
  currentZoneId: string,
  ignoreLockedDoor: boolean = false
): Zone[] {
  const movableZones: Zone[] = [];

  // Find the current zone object
  const currentZoneObj = getZoneFromId(currentZoneId, map);

  // Check all other zones for adjacency
  for (const zone of map.zones) {
    // Skip the current zone
    if (zone.id === currentZoneId) continue;

    // Check if this zone is adjacent to the current zone
    if (areZonesAdjacent(currentZoneObj, zone, map, ignoreLockedDoor)) {
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
  map: Map,
  zombieZone: Zone,
  playerZoneIds: string[]
): VisibleZonesWithPlayers {
  const initialMovableZones = calculateMovableZones(map, zombieZone.id);

  const visibleZonesWithPlayers: VisibleZonesWithPlayers = {};

  initialMovableZones.forEach((movableZone) => {
    const direction = getZoneDirection(zombieZone, movableZone, map);
    if (!direction) return;

    let canMoveInDirection = true;
    let playerFound = false;
    let distance = 0;
    let zoneToCheck = movableZone;
    let hasEnteredRoom = zombieZone.room; // Track if we've entered a room

    while (canMoveInDirection && !playerFound) {
      distance++;

      // Check if we're entering a room from outside
      if (!hasEnteredRoom && zoneToCheck.room) {
        hasEnteredRoom = true;
      }

      // Apply line of sight distance restrictions
      if (hasEnteredRoom) {
        // Inside rooms: line of sight only works one zone away
        if (distance > 1) {
          canMoveInDirection = false;
          return;
        }
      }
      // Outside rooms have no distance limit (continue normally)

      // Check zone for players
      const playersInZone = playerZoneIds.filter(
        (zoneId) => zoneId === zoneToCheck.id
      );
      if (playersInZone.length > 0) {
        // Has line of sight
        playerFound = true;
        visibleZonesWithPlayers[direction] = {
          distance,
          zoneId: zoneToCheck.id,
          noise:
            getZoneFromId(zoneToCheck.id, map).noiseTokens +
            playersInZone.length,
        };
        return;
      } else {
        // get next zone in the same direction
        const nextZone = zoneInDirection(map, zoneToCheck, direction);
        if (nextZone) {
          // Check if we can move to the next zone (door restrictions for room transitions)
          if (!hasEnteredRoom && nextZone.room) {
            // Moving from outside to inside - check if door is open
            if (!areZonesAdjacent(zoneToCheck, nextZone, map, false)) {
              // Door is closed, can't see through
              canMoveInDirection = false;
              return;
            }
          }
          zoneToCheck = nextZone;
        } else {
          canMoveInDirection = false;
          return;
        }
      }
    }
  });
  return visibleZonesWithPlayers;
}

function getZoneDirection(
  fromZone: Zone,
  toZone: Zone,
  map: Map
): Direction | undefined {
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

  // If any of the cols are the same, it's a vertical movement
  if (
    fromZoneCoords[0].col === toZoneCoords[0].col ||
    fromZoneCoords[1]?.col === toZoneCoords[0].col ||
    fromZoneCoords[0].col === toZoneCoords[1]?.col
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
    fromZoneCoords[1]?.row === toZoneCoords[0].row ||
    fromZoneCoords[0].row === toZoneCoords[1]?.row
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

function zoneInDirection(
  map: Map,
  fromZone: Zone,
  direction: Direction
): Zone | undefined {
  const zones = calculateMovableZones(map, fromZone.id);
  let foundZoneInDirection = undefined;
  zones.forEach((zone) => {
    if (getZoneDirection(fromZone, zone, map) === direction) {
      foundZoneInDirection = zone;
      return foundZoneInDirection;
    }
  });
  return foundZoneInDirection;
}

function moveZombiesInDirection(
  map: Map,
  zombieZone: Zone,
  direction: Direction,
  split = 0
) {
  const newZone = zoneInDirection(map, zombieZone, direction);
  if (!newZone) {
    throw new OperationFailedError("Move zombies in direction", {
      message: `Cannot find zone`,
    });
  } else {
    if (split) {
      newZone.zombies += split;
      zombieZone.zombies -= split;
    } else {
      newZone.zombies += zombieZone.zombies;
      zombieZone.zombies = 0;
    }
  }
}

function moveZombiesToZoneId(
  map: Map,
  fromZone: Zone,
  toZoneId: string,
  split: number = 0
) {
  const movableZones = calculateMovableZones(map, fromZone.id);
  const movableZoneIds = movableZones.map((movableZone) => movableZone.id);
  console.log(`Zombie in ${fromZone.id} can move to zones:`, movableZoneIds);
  console.log(`Trying to move to zone: ${toZoneId}`);

  if (!movableZoneIds.includes(toZoneId)) {
    console.log(`Movement blocked! ${toZoneId} not in movable zones`);
    return;
  }

  const toZone = map.zones.find((zone) => toZoneId === zone.id);
  if (!toZone) {
    throw new OperationFailedError("Move zombies to Zone Id", {
      message: `Cannot find zone with id: ${toZoneId}`,
    });
  } else {
    console.log(
      `Successfully moving ${split || fromZone.zombies} zombies from ${
        fromZone.id
      } to ${toZoneId}`
    );
    if (split) {
      toZone.zombies += split;
      fromZone.zombies -= split;
    } else {
      toZone.zombies += fromZone.zombies;
      fromZone.zombies = 0;
    }
  }
}

function getShortestPath(
  map: Map,
  goalZoneIds: string[],
  startZoneId: string,
  ignoreLockedDoor: boolean = false
): Record<string, string[]> {
  let paths: Record<string, string[]> = {};
  goalZoneIds.forEach((goal) => {
    const start = startZoneId;
    const frontier = new Queue<string>();
    frontier.enqueue(start);
    const cameFrom: Record<string, string> = {};
    cameFrom[start] = "";

    while (!frontier.isEmpty()) {
      const current = frontier.dequeue();
      if (current) {
        if (current === goal) break;

        const movableZones = calculateMovableZones(
          map,
          current,
          ignoreLockedDoor
        ).map((zone) => zone.id);
        movableZones.forEach((movableZone) => {
          if (!cameFrom.hasOwnProperty(movableZone)) {
            frontier.enqueue(movableZone);
            cameFrom[movableZone] = current;
          }
        });
      }
    }

    if (cameFrom[goal]) {
      let currentZone = goal;
      const path: string[] = [];
      while (currentZone !== start) {
        path.push(currentZone);
        currentZone = cameFrom[currentZone];
      }
      path.reverse();
      paths[goal] = path;
    } else {
      // Run getShortestPath again, this time ignoring locked doors. We stop movement through doors later anyway, so this will essentially just leave the zombies outside the door of the building
      const pathThroughDoor = getShortestPath(map, [goal], startZoneId, true);
      paths = pathThroughDoor;
    }
  });
  return paths;
}

function calculatePathToNoisiestZone(
  map: Map,
  playerZoneIds: string[],
  zombieZone: Zone
) {
  let highestNoiseLevel = 0;
  let noisiestZones: Zone[] = [];
  map.zones.forEach((zone) => {
    const playersInZone = playerZoneIds.filter((zoneId) => zoneId === zone.id);
    const noiseInZone = zone.noiseTokens + playersInZone.length;
    if (noiseInZone > highestNoiseLevel) {
      noisiestZones = [];
      noisiestZones.push(zone);
      highestNoiseLevel = noiseInZone;
    } else if (noiseInZone === highestNoiseLevel) {
      noisiestZones.push(zone);
    }
  });

  console.log(`Noisiest zones: ${noisiestZones.map((zone) => zone.id)}`);

  if (noisiestZones.length === 1) {
    const goalZoneId = noisiestZones[0].id;
    const path = getShortestPath(map, [goalZoneId], zombieZone.id);
    console.log(
      `Zombie in ${zombieZone.id} trying to path to ${goalZoneId}`,
      path[goalZoneId]
    );
    if (path[goalZoneId] && path[goalZoneId].length > 0) {
      console.log(`Moving to first step: ${path[goalZoneId][0]}`);
      console.log(`Full path: ${path[goalZoneId]}`);
      moveZombiesToZoneId(map, zombieZone, path[goalZoneId][0]);
    } else {
      console.log(`No valid path found to ${goalZoneId}`);
    }
  } else if (noisiestZones.length > 1) {
    // handle split
    const zombiesToSplit = zombieZone.zombies;
    noisiestZones.forEach((zone, index) => {
      const remainder = zombiesToSplit % noisiestZones.length;
      let split = Math.floor(zombiesToSplit / noisiestZones.length);
      if (index < remainder) split++;

      const goalZoneId = noisiestZones[index].id;
      const path = getShortestPath(map, [goalZoneId], zombieZone.id);
      if (path[goalZoneId] && path[goalZoneId].length > 0) {
        moveZombiesToZoneId(map, zombieZone, path[goalZoneId][0], split);
      }
    });
  }
}

function handleZombieAttack(
  zombieZone: Zone,
  playerZoneIds: string[],
  players: Player[]
): { messages?: string[]; isGameLost: boolean } {
  const playersInZone = players.filter((player) =>
    playerZoneIds.includes(player.currentZoneId)
  );
  if (playersInZone.length > 0) {
    let messages: string[] = [];
    let isGameLost = false;

    // Randomly hit a player
    for (let i = 0; i < zombieZone.zombies; i++) {
      const alivePlayers = playersInZone.filter((player) => player.alive);
      if (alivePlayers.length === 0) break;

      const player =
        alivePlayers[Math.floor(Math.random() * alivePlayers.length)];
      console.log(
        `Zombie in ${zombieZone.id} attacking player in ${player.id}`
      );
      player.currentHealth -= 1;
      messages.push(
        `Zombie in ${zombieZone.id} did 1 damage to player ${player.name}`
      );

      if (player.currentHealth <= 0) {
        player.alive = false;
        messages.push(`Player ${player.name} has been killed by zombies`);
        if (!players.some((player) => player.alive)) {
          isGameLost = true;
          messages.push("All players have been killed by zombies. Game over!");
          break;
        }
      }
    }
    return { messages, isGameLost };
  }
  return { isGameLost: false };
}

export function performZombieAction(
  zombieZone: Zone,
  map: Map,
  players: Player[],
  gameStatus: GameStatus
): { messages?: string[]; isGameLost: boolean } {
  if (!zombieZone.zombies || gameStatus === "lost")
    return { isGameLost: false };

  console.log({ players });
  const playerZoneIds = players
    .filter((player) => player.alive)
    .map((player) => player.currentZoneId);

  if (!playerZoneIds) return { isGameLost: false };

  console.log({ playerZoneIds });

  if (playerZoneIds.includes(zombieZone.id)) {
    // handle attack
    const result = handleZombieAttack(zombieZone, playerZoneIds, players);
    return result;
  } else {
    const visibleZonesWithPlayers = hasLineOfSight(
      map,
      zombieZone,
      playerZoneIds
    );

    const numberOfVisibleZones = Object.keys(visibleZonesWithPlayers).length;

    if (numberOfVisibleZones === 1) {
      console.log("One visible zone", visibleZonesWithPlayers);
      moveZombiesInDirection(
        map,
        zombieZone,
        Object.keys(visibleZonesWithPlayers)[0] as Direction
      );
    } else if (numberOfVisibleZones > 1) {
      let directionWithHighestNoise: string[] = [];
      let highestNoiseLevel = 0;

      for (const zone in visibleZonesWithPlayers) {
        const visibleZone = visibleZonesWithPlayers[zone as Direction];
        const noiseLevel = visibleZone?.noise;
        if (!visibleZone || !noiseLevel) return { isGameLost: false };

        if (noiseLevel > highestNoiseLevel) {
          directionWithHighestNoise = [];
          directionWithHighestNoise.push(zone);
          highestNoiseLevel = noiseLevel;
        } else if (noiseLevel === highestNoiseLevel) {
          directionWithHighestNoise.push(zone);
        }
      }

      if (directionWithHighestNoise.length === 1) {
        moveZombiesInDirection(
          map,
          zombieZone,
          directionWithHighestNoise[0] as Direction
        );
      } else {
        // handle split
        const zombiesToSplit = zombieZone.zombies;
        directionWithHighestNoise.forEach((direction, index) => {
          const remainder = zombiesToSplit % directionWithHighestNoise.length;
          let split = Math.floor(
            zombiesToSplit / directionWithHighestNoise.length
          );
          if (index < remainder) split++;
          moveZombiesInDirection(
            map,
            zombieZone,
            direction as Direction,
            split
          );
        });
      }
    } else if (numberOfVisibleZones === 0) {
      // Handle follow noise without line of sight
      console.log("no line of sight");
      calculatePathToNoisiestZone(map, playerZoneIds, zombieZone);
    }

    return { isGameLost: false };
  }
}

export function calculateRangedAttackZones(
  card: Card,
  zone: Zone,
  map: Map
): Zone[] {
  const possibleRangedAttackZones: Zone[] = [];

  if (card.minRange === 0) possibleRangedAttackZones.push(zone);

  ["up", "down", "left", "right"].forEach((direction) => {
    let currentZone = zone;
    for (let i = 0; i < card.maxRange; i++) {
      const nextZoneInDirection = zoneInDirection(
        map,
        currentZone,
        direction as Direction
      );
      if (!nextZoneInDirection) break;
      possibleRangedAttackZones.push(nextZoneInDirection);
      if (nextZoneInDirection.room) break;
      currentZone = nextZoneInDirection;
    }
  });
  return possibleRangedAttackZones;
}

export function spawnZombies(zone: Zone): number {
  // Randomly add between 0-2 zombies. with 1 being the most likely
  const random = Math.random();
  let zombiesToAdd = 1; // Default to 1 (most likely)

  if (random < 0.4) {
    zombiesToAdd = 0; // 40% chance for 0
  } else if (random >= 0.8) {
    zombiesToAdd = 2; // 20% chance for 2
  }
  // 40% chance for 1 (the remaining probability)

  zone.zombies += zombiesToAdd;
  return zombiesToAdd;
}
