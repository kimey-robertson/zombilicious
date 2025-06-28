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
  reset: () => set({ zoom: 1, offset: { x: 0, y: 0 } }),
  isDragging: false,
  setIsDragging: (isDragging) => set({ isDragging }),
  selectedZone: undefined,
  setSelectedZone: (zone: Zone) => set({ selectedZone: zone }),
  panMode: false,
  setPanMode: (panMode) => set({ panMode }),
}));
