import { create } from "zustand";

import type { GameStore } from "./storeTypes";
import { DisconnectedPlayer, GameStatus, Player } from "../../../shared/types";

export const useGameStore = create<GameStore>((set) => ({
  gameId: "",
  setGameId: (gameId: string) => set({ gameId }),
  players: [],
  setPlayers: (players: Player[]) => set({ players }),
  status: "active",
  setStatus: (status: GameStatus) => set({ status }),
  disconnectedPlayers: {},
  setDisconnectedPlayers: (disconnectedPlayers: {
    [key: string]: DisconnectedPlayer;
  }) => set({ disconnectedPlayers }),
  disconnectTimers: {},
  setDisconnectTimers: (disconnectTimers) =>
    set((state) => ({
      disconnectTimers:
        typeof disconnectTimers === "function"
          ? disconnectTimers(state.disconnectTimers)
          : disconnectTimers,
    })),
  gameLogs: [],
  setGameLogs: (gameLogs) =>
    set((state) => ({
      gameLogs:
        typeof gameLogs === "function" ? gameLogs(state.gameLogs) : gameLogs,
    })),
  map: {
    id: "",
    tiles: [],
    zones: [],
    doors: [],
    startingZone: "",
    winCondition: {
      type: "objective",
      goal: 0,
      current: 0,
    },
  },
  setMap: (map) => set({ map }),
  isZombiesTurn: false,
  setIsZombiesTurn: (isZombiesTurn: boolean) => set({ isZombiesTurn }),
}));
