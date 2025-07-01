import { create } from "zustand";

import type { LobbyStore } from "./storeTypes";

export const useLobbyStore = create<LobbyStore>((set) => ({
  myLobbyId: "",
  setMyLobbyId: (lobbyId) => set({ myLobbyId: lobbyId }),
  lobbies: [],
  setLobbies: (lobbies) => set({ lobbies }),
}));
