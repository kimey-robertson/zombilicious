import { create } from "zustand";

import type { GameStore } from "./storeTypes";

export const useGameStore = create<GameStore>((set) => ({
  games: [],
  setGames: (games) =>
    set((state) => ({
      games: typeof games === "function" ? games(state.games) : games,
    })),
}));
