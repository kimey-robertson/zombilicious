import toast from "react-hot-toast";
import { socket } from "../../socket";
import { Button } from "../UI/Button";

const HomeButtons = ({
  setCreateGameScreen,
  setJoinGameScreen,
  playerName,
  setPlayerName,
}: {
  setCreateGameScreen: (value: boolean) => void;
  setJoinGameScreen: (value: boolean) => void;
  playerName: string;
  setPlayerName: (value: string) => void;
}) => {
  const handleCreateLobby = () => {
    if (!playerName) {
      return;
    }

    socket.emit(
      "create-game-lobby",
      { playerName },
      (response: { success: boolean; errorMessage?: string }) => {
        if (!response.success) {
          toast.error(response.errorMessage || "Failed to create lobby");
          return;
        }
      }
    );

    setCreateGameScreen(true);
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
        />
        <div className="flex gap-2 justify-center items-center w-full">
          <Button className="p-10 w-full" onClick={handleCreateLobby}>
            Create Game
          </Button>
          <Button
            className="text-4xl w-full"
            onClick={() => setJoinGameScreen(true)}
          >
            Join Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HomeButtons;
