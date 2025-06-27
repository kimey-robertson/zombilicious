import { useRef } from "react";
import { usePlayerStore } from "../store/usePlayerStore";
import type { Offset } from "../store/storeTypes";

const GameBoard = () => {
  const size = 2;
  const tiles = Array.from({ length: size * size }, (_, index) => index);

  const zoom = usePlayerStore((state) => state.zoom);
  const setZoom = usePlayerStore((state) => state.setZoom);
  const offset = usePlayerStore((state) => state.offset);
  const setOffset = usePlayerStore((state) => state.setOffset);

  const isDragging = useRef(false);
  const lastPosition = useRef({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    lastPosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging.current) return;

    // Calculate the difference between the current mouse position and the last position
    const dx = e.clientX - lastPosition.current.x;
    const dy = e.clientY - lastPosition.current.y;
    lastPosition.current = { x: e.clientX, y: e.clientY };
    setOffset((prev: Offset) => ({ x: prev.x + dx, y: prev.y + dy }));

    // An attempt to make it so the grid can't be dragged out of the screen

    // setOffset((prev) => {
    //   const gridWidth = size * 300 * zoom;
    //   const gridHeight = size * 300 * zoom;
    //   const wrapperWidth = window.innerWidth;
    //   const wrapperHeight = window.innerHeight;

    //   let newX = prev.x + dx;
    //   let newY = prev.y + dy;

    //   if (gridWidth > wrapperWidth) {
    //     const minX = wrapperWidth - gridWidth;
    //     const maxX = 0;
    //     newX = Math.min(maxX, Math.max(newX, minX));
    //   }

    //   if (gridHeight > wrapperHeight) {
    //     const minY = wrapperHeight - gridHeight;
    //     const maxY = 0;
    //     newY = Math.min(maxY, Math.max(newY, minY));
    //   }

    //   return { x: newX, y: newY };
    //   const maxX = 0;
    //   const minX = wrapperWidth - gridWidth;
    //   const maxY = 0;
    //   const minY = wrapperHeight - gridHeight;

    //   const newX = Math.min(maxX, Math.max(prev.x + dx, minX));
    //   const newY = Math.min(maxY, Math.max(prev.y + dy, minY));

    //   return { x: newX, y: newY };
    // });
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    e.preventDefault();
    const zoomAmount = e.deltaY > 0 ? -0.005 : 0.005;
    setZoom((prev: number) => Math.max(0.5, Math.min(prev + zoomAmount, 2)));
  };

  return (
    <div className="game-board-wrapper">
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onWheel={handleWheel}
        className="game-board-grid"
        style={{
          transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`,
        }}
      >
        {tiles.map((tile) => (
          <div key={tile} className="game-board-tile">
            {tile}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GameBoard;
