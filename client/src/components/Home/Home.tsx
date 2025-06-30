import { useState } from "react";
import HomeButtons from "./HomeButtons";
import CreateGameScreen from "./CreateGameScreen";
import JoinGameScreen from "./JoinGameScreen";
import "./Home.css";

const Home = () => {
  const [createGameScreen, setCreateGameScreen] = useState(false);
  const [joinGameScreen, setJoinGameScreen] = useState(false);
  return (
    <div className="flex flex-col items-center h-screen p-3 gap-4">
      <h3 className="text-4xl font-bold home-title">Zombilicious</h3>
      {!createGameScreen && !joinGameScreen ? (
        <HomeButtons
          setCreateGameScreen={setCreateGameScreen}
          setJoinGameScreen={setJoinGameScreen}
        />
      ) : null}
      {createGameScreen ? <CreateGameScreen /> : null}
      {joinGameScreen ? <JoinGameScreen /> : null}
    </div>
  );
};

export default Home;
