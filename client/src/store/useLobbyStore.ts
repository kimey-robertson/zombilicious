import { create } from "zustand";

import type { LobbyStore } from "./storeTypes";

export const useLobbyStore = create<LobbyStore>((set) => ({
  myLobbyId: "",
  setMyLobbyId: (lobbyId) => set({ myLobbyId: lobbyId }),
  lobbies: [],
  setLobbies: (lobbies) =>
    set((state) => ({
      lobbies: typeof lobbies === "function" ? lobbies(state.lobbies) : lobbies,
    })),
  reconnectableGames: [],
  setReconnectableGames: (games) =>
    set({ reconnectableGames: games }),
}));