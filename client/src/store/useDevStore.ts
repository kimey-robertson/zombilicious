import { create } from "zustand";
import { DevStore } from "./storeTypes";

export const useDevStore = create<DevStore>((set) => ({
  devMode: false,
  setDevMode: (devMode) => set({ devMode }),
  hideOverlay: false,
  setHideOverlay: (hideOverlay) => set({ hideOverlay }),
}));
