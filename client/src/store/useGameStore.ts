import { create } from "zustand";

import type { GameStore } from "./storeTypes";

export const useGameStore = create<GameStore>((set) => ({
  gameId: "",
  setGameId: (gameId: string) => set({ gameId }),
}));
