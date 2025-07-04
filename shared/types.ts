export type Tile = {
  id: string;
  position: {
    x: number;
    y: number;
  };
  cells: Cell[];
  rotation: 0 | 90 | 180 | 270;
};

export type Cell = {
  id: string;
  tileId: string;
  row: number;
  col: number;
};

export type Zone = {
  id: string;
  cellIds: string[];
  tileIds: string[];
  room: boolean;
};

export type Door = {
  id: string;
  cellIds: string[];
  tileId: string;
  transform: string;
};

export type Map = {
  id: string;
  tiles: Tile[];
  zones: Zone[];
  doors: Door[];
};

export type Player = {
  id: string;
  name: string;
  myTurn: boolean;
  totalActions: number;
  actionsRemaining: number;
  XP: number;
  playerCards: {
    inReserve: Card[];
    inHand: Card[];
  };
};

export type LobbyPlayer = {
  id: string;
  name: string;
  isHost: boolean;
  isReady: boolean;
};

export type Lobby = {
  id: string;
  gameName: string;
  players: LobbyPlayer[];
};

export type DisconnectedPlayer = {
  name: string;
  disconnectedAt: Date;
  kickVotes: string[];
  id: string;
  stopDisconnectTimer?: () => void;
};

export type Game = {
  id: string;
  name: string;
  players: Player[];
  status: "active" | "paused";
  disconnectedPlayers: { [socketId: string]: DisconnectedPlayer };
  gameLogs: LogEvent[];
  map: Map;
};

export type LogEvent = {
  id: string;
  timestamp: Date;
  type:
    | "combat"
    | "movement"
    | "item"
    | "zombie"
    | "survivor"
    | "noise"
    | "system";
  message: string;
  icon?: string;
};

export type Card = {
  id: string;
  name: string;
};
