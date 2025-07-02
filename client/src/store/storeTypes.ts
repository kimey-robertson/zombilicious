import { Lobby, Zone } from "../../../shared/types";

export type Offset = { x: number; y: number };

export type PlayerStore = {
  zoom: number;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  offset: Offset;
  setOffset: (offset: Offset | ((prev: Offset) => Offset)) => void;
  rotation: number;
  setRotation: (rotation: number | ((prev: number) => number)) => void;
  resetBoardPosition: () => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  selectedZone: Zone | undefined;
  setSelectedZone: (zone: Zone) => void;
  panMode: boolean;
  setPanMode: (panMode: boolean) => void;
  devMode: boolean;
  setDevMode: (devMode: boolean) => void;
  hideOverlay: boolean;
  setHideOverlay: (hideOverlay: boolean) => void;
  playerName: string;
  setPlayerName: (playerName: string) => void;
  playerId: string;
  setPlayerId: (playerId: string) => void;
  totalActions: number;
  setTotalActions: (totalActions: number) => void;
  actionsRemaining: number;
  setActionsRemaining: (actionsRemaining: number) => void;
  resetGame: () => void;
};

export type LobbyStore = {
  myLobbyId: string;
  setMyLobbyId: (lobbyId: string) => void;
  lobbies: Lobby[];
  setLobbies: (lobbies: Lobby[] | ((prev: Lobby[]) => Lobby[])) => void;
};

export type GameStore = {
  gameId: string;
  setGameId: (gameId: string) => void;
};
