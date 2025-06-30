import { Zone } from "../../../shared/types";

export type Offset = { x: number; y: number };

export type PlayerStore = {
  zoom: number;
  setZoom: (zoom: number | ((prev: number) => number)) => void;
  offset: Offset;
  setOffset: (offset: Offset | ((prev: Offset) => Offset)) => void;
  rotation: number;
  setRotation: (rotation: number | ((prev: number) => number)) => void;
  reset: () => void;
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  selectedZone: Zone | undefined;
  setSelectedZone: (zone: Zone) => void;
  panMode: boolean;
  setPanMode: (panMode: boolean) => void;
  devMode: boolean;
  setDevMode: (devMode: boolean) => void;
  hideOverlay: boolean;
  setHideOverlay: (hideOverlay: boolean) => void;
};
