import { useState } from "react";
import HomeButtons from "./HomeButtons";
import LobbyScreen from "./LobbyScreen";
import JoinLobbiesScreen from "./JoinLobbiesScreen";
import { useLobbySockets } from "../../hooks/useLobbySockets";

const Home = () => {
  const [lobbyScreen, setLobbyScreen] = useState(false);
  const [joinLobbiesScreen, setJoinLobbiesScreen] = useState(false);
  const [playerName, setPlayerName] = useState("");

  useLobbySockets();

  return (
    <div className="flex flex-col items-center h-screen p-3 gap-4">
      <h3 className="text-4xl font-bold zombilicious">Zombilicious</h3>
      {!lobbyScreen && !joinLobbiesScreen ? (
        <HomeButtons
          setLobbyScreen={setLobbyScreen}
          setJoinLobbiesScreen={setJoinLobbiesScreen}
          playerName={playerName}
          setPlayerName={setPlayerName}
        />
      ) : lobbyScreen ? (
        <LobbyScreen setLobbyScreen={setLobbyScreen} />
      ) : joinLobbiesScreen ? (
        <JoinLobbiesScreen playerName={playerName} />
      ) : null}
    </div>
  );
};

export default Home;
