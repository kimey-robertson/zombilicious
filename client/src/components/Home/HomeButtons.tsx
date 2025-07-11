import { getSocket } from "../../socket";
import { Button } from "../UI/Button";
import { useRef } from "react";
import { usePlayerStore } from "../../store/usePlayerStore";
import { SocketResponse } from "../../../../shared/types";
import { useHandleError } from "../../hooks/useHandleError";

const HomeButtons = ({
  setLobbyScreen,
  setJoinLobbiesScreen,
}: {
  setLobbyScreen: (value: boolean) => void;
  setJoinLobbiesScreen: (value: boolean) => void;
}) => {
  const socket = getSocket();
  const inputRef = useRef<HTMLInputElement | null>(null);

  const playerName = usePlayerStore((state) => state.playerName);
  const setPlayerName = usePlayerStore((state) => state.setPlayerName);
  const setPlayerId = usePlayerStore((state) => state.setPlayerId);

  const handleError = useHandleError();

  const handleCreateLobby = () => {
    if (!playerName) {
      inputRef.current?.focus();
      return;
    }
    setPlayerId(socket.id || "");

    socket.emit(
      "create-game-lobby",
      { playerName },
      (response: SocketResponse) => {
        if (!response.success) {
          handleError(response?.error);
          return;
        } else {
          setLobbyScreen(true);
        }
      }
    );
  };

  const handleJoinLobbies = () => {
    if (!playerName) {
      inputRef.current?.focus();
      return;
    }
    setPlayerId(socket.id || "");

    setJoinLobbiesScreen(true);
  };

  return (
    <div className="flex items-center justify-center gap-2 w-full h-full">
      <div className="flex flex-col gap-2 justify-center items-center w-[40vw]">
        <input
          type="text"
          placeholder="Player Name"
          className="w-full p-2 rounded-md text-black bg-[#8b8b8b96] font-extrabold text-center focus:outline-none focus:ring-2 focus:ring-red-500"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          ref={inputRef}
          maxLength={24}
        />
        <div className="flex gap-2 justify-center items-center w-full">
          <Button className="p-10 w-full" onClick={handleCreateLobby}>
            Create Game
          </Button>
          <Button className="text-4xl w-full" onClick={handleJoinLobbies}>
            Join Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeButtons;
