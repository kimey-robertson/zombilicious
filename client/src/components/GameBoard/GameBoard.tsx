import { useRef } from "react";
import { usePlayerStore } from "../../store/usePlayerStore";
import type { Offset } from "../../store/storeTypes";
import Tiles from "./Tiles";

const GameBoard = () => {
  // Think about using a single state object instead of multiple state hooks
  const zoom = usePlayerStore((state) => state.zoom);
  const setZoom = usePlayerStore((state) => state.setZoom);
  const offset = usePlayerStore((state) => state.offset);
  const setOffset = usePlayerStore((state) => state.setOffset);
  const isDragging = usePlayerStore((state) => state.isDragging);
  const setIsDragging = usePlayerStore((state) => state.setIsDragging);
  const panMode = usePlayerStore((state) => state.panMode);

  const lastPosition = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!panMode) return;
    setIsDragging(true);
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !panMode) return;

    // Calculate the difference between the current mouse position and the last position
    const dx = e.clientX - lastPosition.current.x;
    const dy = e.clientY - lastPosition.current.y;
    lastPosition.current = { x: e.clientX, y: e.clientY };
    setOffset((prev: Offset) => ({ x: prev.x + dx, y: prev.y + dy }));
  };

  const handleMouseUp = () => {
    if (!panMode) return;
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomAmount = e.deltaY > 0 ? -0.01 : 0.01;
    setZoom((prev: number) => Math.max(0.5, Math.min(prev + zoomAmount, 2)));
  };

  return (
    <div
      className="game-board-wrapper"
      style={{
        cursor:
          panMode && !isDragging ? "grab" : isDragging ? "grabbing" : "pointer",
      }}
    >
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        onMouseLeave={handleMouseUp}
        className="game-board-grid"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
        }}
      >
        <Tiles />
      </div>
    </div>
  );
};

export default GameBoard;
