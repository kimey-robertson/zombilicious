import { usePlayerStore } from "../store/usePlayerStore";

const Overlay = () => {
  const reset = usePlayerStore((state) => state.reset);

  return (
    <div className="overlay-wrapper">
      <div className="overlay">
        <h2 className="m-0">Zombilicious</h2>
        <h2 onClick={reset} className="cursor-pointer">
          Reset board position
        </h2>
      </div>
    </div>
  );
};

export default Overlay;
