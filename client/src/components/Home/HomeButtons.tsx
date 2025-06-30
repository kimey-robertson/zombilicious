import React from "react";
import { Button } from "../UI/Button";

const HomeButtons = ({
  setCreateGameScreen,
  setJoinGameScreen,
}: {
  setCreateGameScreen: (value: boolean) => void;
  setJoinGameScreen: (value: boolean) => void;
}) => {
  return (
    <div className="flex items-center justify-center gap-2 w-full h-full">
      <Button className="p-10" onClick={() => setCreateGameScreen(true)}>
        Create Game
      </Button>
      <Button className="text-4xl" onClick={() => setJoinGameScreen(true)}>
        Join Game
      </Button>
    </div>
  );
};

export default HomeButtons;
