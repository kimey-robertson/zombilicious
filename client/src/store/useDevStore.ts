import { create } from "zustand";
import { DevStore } from "./storeTypes";
import { Card } from "../../../shared/types";
import { usePlayerStore } from "./usePlayerStore";

export const useDevStore = create<DevStore>((set) => ({
  devMode: false,
  setDevMode: (devMode) => set({ devMode }),
  hideOverlay: false,
  setHideOverlay: (hideOverlay) => set({ hideOverlay }),
  // Helper function to add test cards for demonstration
  addTestCards: () =>
    usePlayerStore.getState().setPlayerCards({
      inReserve: [testCards[0], null, testCards[1]], // Sparse array demo
      inHand: [null, testCards[2]], // Card in right position only
    }),

  // Helper function to clear all cards
  clearAllCards: () =>
    usePlayerStore.getState().setPlayerCards({
      inReserve: [null, null, null], // 3 empty slots
      inHand: [null, null], // 2 empty slots
    }),
}));

// Test cards for demonstration
const testCards: Card[] = [
  {
    id: "test-1",
    name: "Crowbar",
    canOpenDoorsWithoutNoise: true,
    canOpenDoorsWithNoise: false,
  },
  {
    id: "test-2",
    name: "Fire Axe",
    canOpenDoorsWithoutNoise: false,
    canOpenDoorsWithNoise: true,
  },
  {
    id: "test-3",
    name: "Lockpick",
    canOpenDoorsWithoutNoise: true,
    canOpenDoorsWithNoise: false,
  },
  {
    id: "test-4",
    name: "Shotgun",
    canOpenDoorsWithoutNoise: false,
    canOpenDoorsWithNoise: true,
  },
];
