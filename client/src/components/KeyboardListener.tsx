import { useEffect } from "react";
import { usePlayerStore } from "../store/usePlayerStore";

const KeyboardListener = () => {
  const setPanMode = usePlayerStore((state) => state.setPanMode);
  const setIsDragging = usePlayerStore((state) => state.setIsDragging);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setPanMode(true);
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        setPanMode(false);
        setIsDragging(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [setPanMode]);

  return null;
};

export default KeyboardListener;
