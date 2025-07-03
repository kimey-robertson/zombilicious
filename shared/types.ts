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

export type Map = {
  id: string;
  tiles: Tile[];
  zones: Zone[];
};

export type Player = {
  id: string;
  name: string;
};

export type LobbyPlayer = Player & {
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
};

export type Game = {
  id: string;
  name: string;
  players: Player[];
  status: "active" | "paused";
  disconnectedPlayers: { [socketId: string]: DisconnectedPlayer };
};
