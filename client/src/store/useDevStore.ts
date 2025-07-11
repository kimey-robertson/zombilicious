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
    id: "1",
    name: "Crowbar",
    canOpenDoorsWithoutNoise: true,
    canOpenDoorsWithNoise: false,
    createsNoiseWhenAttacking: false,
    minRange: 0,
    maxRange: 0,
    numberOfDice: 1,
    rollRequired: 4,
    damage: 1,
  },
  {
    id: "2",
    name: "Fire Axe",
    canOpenDoorsWithoutNoise: false,
    canOpenDoorsWithNoise: true,
    createsNoiseWhenAttacking: false,
    minRange: 0,
    maxRange: 0,
    numberOfDice: 1,
    rollRequired: 4,
    damage: 2,
  },
  {
    id: "3",
    name: "Pan",
    canOpenDoorsWithoutNoise: false,
    canOpenDoorsWithNoise: false,
    createsNoiseWhenAttacking: false,
    minRange: 0,
    maxRange: 0,
    numberOfDice: 1,
    rollRequired: 6,
    damage: 1,
  },
  {
    id: "4",
    name: "Pistol",
    canOpenDoorsWithoutNoise: false,
    canOpenDoorsWithNoise: false,
    createsNoiseWhenAttacking: true,
    minRange: 0,
    maxRange: 1,
    numberOfDice: 1,
    rollRequired: 4,
    damage: 1,
  },
  {
    id: "5",
    name: "Rifle",
    canOpenDoorsWithoutNoise: false,
    canOpenDoorsWithNoise: false,
    createsNoiseWhenAttacking: true,
    minRange: 1,
    maxRange: 3,
    numberOfDice: 1,
    rollRequired: 3,
    damage: 1,
  },
];
