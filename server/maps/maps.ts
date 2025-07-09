import { getTileCells } from "../utils/helpers";
import type { Map } from "../../shared/types";

const tutorialMap: Map = {
  id: "tutorial",
  tiles: [
    {
      id: "2B",
      position: { x: 0, y: 0 },
      rotation: 90,
      cells: getTileCells("2B"),
    },
    {
      id: "1B",
      position: { x: 0, y: 1 },
      rotation: 0,
      cells: getTileCells("1B"),
    },
  ],
  zones: [
    {
      id: "2B-0",
      cellIds: ["2B-0"],
      tileIds: ["2B"],
      room: false,
    },
    {
      id: "2B-1",
      cellIds: ["2B-1"],
      tileIds: ["2B"],
      room: true,
    },
    {
      id: "2B-2",
      cellIds: ["2B-2"],
      tileIds: ["2B"],
      room: true,
    },
    {
      id: "2B-3",
      cellIds: ["2B-3"],
      tileIds: ["2B"],
      room: false,
    },
    {
      id: "2B-4",
      cellIds: ["2B-4"],
      tileIds: ["2B"],
      room: true,
    },
    {
      id: "2B-5",
      cellIds: ["2B-5"],
      tileIds: ["2B"],
      room: true,
    },
    {
      id: "2B-6/1B-0",
      cellIds: ["2B-6", "1B-0"],
      tileIds: ["2B", "1B"],
      room: false,
    },
    {
      id: "2B-7/1B-1",
      cellIds: ["2B-7", "1B-1"],
      tileIds: ["2B", "1B"],
      room: false,
    },
    {
      id: "2B-8/1B-2",
      cellIds: ["2B-8", "1B-2"],
      tileIds: ["2B", "1B"],
      room: false,
    },
    {
      id: "1B-3/1B-4",
      cellIds: ["1B-3", "1B-4"],
      tileIds: ["1B"],
      room: true,
    },
    {
      id: "1B-5",
      cellIds: ["1B-5"],
      tileIds: ["1B"],
      room: false,
    },
    {
      id: "1B-6",
      cellIds: ["1B-6"],
      tileIds: ["1B"],
      room: true,
    },
    {
      id: "1B-7",
      cellIds: ["1B-7"],
      tileIds: ["1B"],
      room: true,
    },
    {
      id: "1B-8",
      cellIds: ["1B-8"],
      tileIds: ["1B"],
      room: false,
    },
  ],
  doors: [
    {
      id: "1B-7/1B-8",
      cellIds: ["1B-7", "1B-8"],
      tileId: "1B",
      transform: "translate(-12px, 104px) rotate(90deg)",
      state: "closed",
    },
    {
      id: "2B-4/2B-7",
      cellIds: ["2B-4", "2B-7"],
      tileId: "2B",
      transform: "translate(30px, 6px) rotate(0)",
      state: "closed",
    },
  ],
  startingZone: "1B-6",
};

export { tutorialMap };
