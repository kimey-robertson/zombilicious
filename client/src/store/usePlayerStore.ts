import { create } from "zustand";

import type { PlayerStore } from "./storeTypes";
import { Zone } from "../../../shared/types";

export const usePlayerStore = create<PlayerStore>((set) => ({
  zoom: 1,
  setZoom: (zoom) =>
    set((state) => ({
      zoom: typeof zoom === "function" ? zoom(state.zoom) : zoom,
    })),
  offset: { x: 0, y: 0 },
  setOffset: (offset) =>
    set((state) => ({
      offset: typeof offset === "function" ? offset(state.offset) : offset,
    })),
  rotation: 0,
  setRotation: (rotation) =>
    set((state) => ({
      rotation:
        typeof rotation === "function" ? rotation(state.rotation) : rotation,
    })),
  resetBoardPosition: () =>
    set({ zoom: 1, offset: { x: 0, y: 0 }, rotation: 0 }),
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
  selectedZone: undefined,
  setSelectedZone: (zone: Zone) => set({ selectedZone: zone }),
  panMode: false,
  setPanMode: (panMode) => set({ panMode }),
  playerName: "",
  setPlayerName: (playerName) => set({ playerName }),
  playerId: "",
  setPlayerId: (playerId) => set({ playerId }),
  totalActions: 3,
  setTotalActions: (totalActions) => set({ totalActions }),
  actionsRemaining: 3,
  setActionsRemaining: (actionsRemaining) => set({ actionsRemaining }),
  XP: 0,
  setXP: (XP) => set({ XP }),
  playerCards: {
    inReserve: [null, null, null],
    inHand: [null, null],
    swappableCard: null,
  },
  setPlayerCards: (playerCards) => set({ playerCards }),
  isMyTurn: false,
  setIsMyTurn: (isMyTurn) => set({ isMyTurn }),
  selectedAction: undefined,
  setSelectedAction: (selectedAction) => set({ selectedAction }),
}));
