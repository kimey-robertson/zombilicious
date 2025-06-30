import { create } from "zustand";

import type { GameCreationStore } from "./storeTypes";

export const useGameCreationStore = create<GameCreationStore>((set) => ({
    gameName: "",
    setGameName: (gameName) => set({ gameName }),
    players: [],
    setPlayers: (players) => set({ players }),
}));