import { create } from "zustand";

import type { LobbyStore } from "./storeTypes";

export const useLobbyStore = create<LobbyStore>((set) => ({
  lobbyId: "",
  setLobbyId: (lobbyId) => set({ lobbyId }),
  lobbyName: "",
  setLobbyName: (lobbyName) => set({ lobbyName }),
  lobbyPlayers: [],
  setLobbyPlayers: (lobbyPlayers) => set({ lobbyPlayers }),
}));
