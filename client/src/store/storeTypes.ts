import { Game, DisconnectedPlayer, Lobby, Player, Zone } from "../../../shared/types";

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
  reconnectableGames: Game[];
  setReconnectableGames: (games: Game[]) => void;
};

export type GameStore = {
  gameId: string;
  setGameId: (gameId: string) => void;
  players: Player[];
  setPlayers: (players: Player[]) => void;
  status: "active" | "paused";
  setStatus: (status: "active" | "paused") => void;
  disconnectedPlayers: { [key: string]: DisconnectedPlayer };
  setDisconnectedPlayers: (disconnectedPlayers: {
    [key: string]: DisconnectedPlayer;
  }) => void;
  disconnectTimers: { [key: string]: string };
  setDisconnectTimers: (
    disconnectTimers:
      | { [key: string]: string }
      | ((prev: { [key: string]: string }) => { [key: string]: string })
  ) => void;
};
