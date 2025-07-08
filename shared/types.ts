import { Server, Socket } from "socket.io";

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
  startingZone: string;
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
  currentZone: string;
  movableZones: Zone[];
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

export type SocketError = {
  code: string;
  message: string;
  details?: any; //TODO: make this more specific
};

export type SocketResponse = {
  success: boolean;
  error?: SocketError;
};

export type SocketCallback = (response: SocketResponse) => void;

export enum SocketErrorCodes {
  // Lobby
  LOBBY_NOT_FOUND = "LOBBY_NOT_FOUND",
  LOBBY_PLAYER_NOT_FOUND = "LOBBY_PLAYER_NOT_FOUND",

  // Game
  GAME_NOT_FOUND = "GAME_NOT_FOUND",

  // General
  OPERATION_FAILED = "OPERATION_FAILED",
  INTERNAL_ERROR = "INTERNAL_ERROR",
}

export type SocketHandlerFunction<T = any> = (
  io: Server,
  socket: Socket,
  data: T
) => Promise<SocketResponse> | SocketResponse;
