import { create } from "zustand";

import type { LobbyStore } from "./storeTypes";

export const useLobbyStore = create<LobbyStore>((set) => ({
  gameName: "",
  setGameName: (gameName) => set({ gameName }),
  gameId: "",
  setGameId: (gameId) => set({ gameId }),
  players: [],
  setPlayers: (players) => set({ players }),
}));
