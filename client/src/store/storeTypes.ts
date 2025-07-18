import {
  Game,
  DisconnectedPlayer,
  Lobby,
  Player,
  Zone,
  LogEvent,
  Card,
  Map,
} from "../../../shared/types";
import { GameAction } from "../components/Overlay/ActionButtons";

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
  playerName: string;
  setPlayerName: (playerName: string) => void;
  playerId: string;
  setPlayerId: (playerId: string) => void;
  totalActions: number;
  setTotalActions: (totalActions: number) => void;
  actionsRemaining: number;
  setActionsRemaining: (actionsRemaining: number) => void;
  XP: number;
  setXP: (XP: number) => void;
  playerCards: {
    inReserve: Card[];
    inHand: Card[];
  };
  setPlayerCards: (playerCards: { inReserve: Card[]; inHand: Card[] }) => void;
  isMyTurn: boolean;
  setIsMyTurn: (isMyTurn: boolean) => void;
  selectedAction: GameAction | undefined;
  setSelectedAction: (selectedAction: GameAction | undefined) => void;
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
  status: "active" | "paused" | "zombies-turn";
  setStatus: (status: "active" | "paused" | "zombies-turn") => void;
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
  gameLogs: LogEvent[];
  setGameLogs: (
    gameLogs: LogEvent[] | ((prev: LogEvent[]) => LogEvent[])
  ) => void;
  map: Map;
  setMap: (map: Map) => void;
};

export type DevStore = {
  devMode: boolean;
  setDevMode: (devMode: boolean) => void;
  hideOverlay: boolean;
  setHideOverlay: (hideOverlay: boolean) => void;
};
