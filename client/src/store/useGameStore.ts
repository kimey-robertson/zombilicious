import { create } from "zustand";

import type { GameStore } from "./storeTypes";
import { DisconnectedPlayer, Player } from "../../../shared/types";

export const useGameStore = create<GameStore>((set) => ({
  gameId: "",
  setGameId: (gameId: string) => set({ gameId }),
  players: [],
  setPlayers: (players: Player[]) => set({ players }),
  status: "active",
  setStatus: (status: "active" | "paused") => set({ status }),
  disconnectedPlayers: {},
  setDisconnectedPlayers: (disconnectedPlayers: {
    [key: string]: DisconnectedPlayer;
  }) => set({ disconnectedPlayers }),
}));
