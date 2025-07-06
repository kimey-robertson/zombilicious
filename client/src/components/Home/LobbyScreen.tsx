import { Button } from "../UI/Button";
import { useLobbyStore } from "../../store/useLobbyStore";
import { getSocket } from "../../socket";
import { toast } from "react-hot-toast";
import { usePlayerStore } from "../../store/usePlayerStore";

const LobbyScreen = ({
  setLobbyScreen,
}: {
  setLobbyScreen?: (value: boolean) => void;
}) => {
  const socket = getSocket();
  const myLobbyId = useLobbyStore((state) => state.myLobbyId);
  const setMyLobbyId = useLobbyStore((state) => state.setMyLobbyId);
  const lobbies = useLobbyStore((state) => state.lobbies);

  const myLobby = lobbies.find((lobby) => lobby.id === myLobbyId);

  const playerId = usePlayerStore((state) => state.playerId);

  const currentPlayer = myLobby?.players.find((p) => p.id === playerId);

  const canStartGame =
    currentPlayer?.isHost &&
    myLobby?.players?.every((player) => player.isReady);

  const handleReturnToHome = () => {
    if (currentPlayer?.isHost) {
      socket.emit(
        "delete-game-lobby",
        myLobbyId,
        (data: { success: boolean; errorMessage?: string }) => {
          if (data.success) {
            setLobbyScreen?.(false);
            toast.success("Lobby deleted");
          } else {
            toast.error(data.errorMessage || "Failed to delete lobby");
          }
        }
      );
    } else {
      socket.emit(
        "leave-lobby",
        myLobbyId,
        (data: { success: boolean; errorMessage?: string }) => {
          if (data.success) {
            setLobbyScreen?.(false);
            setMyLobbyId("");
          } else {
            toast.error(data.errorMessage || "Failed to leave lobby");
          }
        }
      );
    }
  };

  const handleToggleIsReadyLobbyPlayer = (playerId: string) => {
    socket.emit(
      "toggle-is-ready-lobby-player",
      playerId,
      (data: { success: boolean; errorMessage?: string }) => {
        if (!data.success) {
          toast.error(data.errorMessage || "Failed to ready player");
        }
      }
    );
  };

  const handleChangeGameName = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentPlayer?.isHost) {
      return;
    }

    socket.emit(
      "change-game-name-lobby",
      {
        lobbyId: myLobbyId,
        gameName: e.target.value,
        playerId: currentPlayer?.id,
      },
      (data: { success: boolean; errorMessage?: string }) => {
        if (!data.success) {
          toast.error(data.errorMessage || "Failed to change game name");
        }
      }
    );
  };

  const handleCreateGame = () => {
    socket.emit(
      "create-game",
      myLobby,
      (data: { success: boolean; errorMessage?: string }) => {
        if (!data.success) {
          toast.error(data.errorMessage || "Failed to start game");
        }
      }
    );
  };

  return (
    <div className="h-[80vh] w-[70vw] m-auto bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-hidden rounded-[30px]">
      <div className="container m-auto px-4 py-6 h-full flex flex-col ">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-red-500 mb-1 drop-shadow-lg ">
            Create Game
          </h1>
          <p className="text-gray-300 opacity-80 text-sm">
            Set up your zombie survival game
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-7xl flex-1 min-h-0">
          {/* Players List - Left Side */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-4 border border-gray-700 border-opacity-50 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-yellow-400">
                Players ({myLobby?.players.length}/{4})
              </h2>
            </div>

            {/* Player List */}
            <div className="space-y-2 mb-4 flex-1 overflow-y-auto">
              {myLobby?.players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-gray-800 bg-opacity-60 rounded-lg p-3 border border-gray-600 border-opacity-40"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        player.isReady ? "bg-green-500" : "bg-red-500"
                      }`}
                    />
                    <span className="font-medium">{player.name}</span>
                    {player.isHost && (
                      <span className="px-2 py-1 text-xs bg-yellow-600 bg-opacity-70 rounded-full text-yellow-100">
                        Host
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {player.id === currentPlayer?.id && !player.isHost ? (
                      <>
                        <Button
                          size="sm"
                          className="text-xs"
                          onClick={() =>
                            handleToggleIsReadyLobbyPlayer(player.id)
                          }
                        >
                          {player.isReady ? "Unready" : "Ready"}
                        </Button>
                      </>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Settings - Right Side */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-4 border border-gray-700 border-opacity-50 flex flex-col min-h-0">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-yellow-400">
                Game Settings
              </h2>
              <div>
                <h4 className="text-sm text-gray-300">Lobby ID: {myLobbyId}</h4>
              </div>
            </div>

            <div className="space-y-4 flex-1 overflow-y-auto px-1">
              {/* Game Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Game Name
                </label>
                <input
                  type="text"
                  value={myLobby?.gameName}
                  disabled={!currentPlayer?.isHost}
                  onChange={handleChangeGameName}
                  maxLength={28}
                  className="w-full bg-gray-700 bg-opacity-60 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Max Players */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Players
                </label>
                <select
                  value={4}
                  // onChange={(e) => {return e}}
                  className="w-full bg-gray-700 bg-opacity-60 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {[4].map((num) => (
                    <option key={num} value={num}>
                      {num} Players
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center space-x-4 mt-4 flex-shrink-0">
          <Button
            variant="outline"
            size="lg"
            className="bg-gray-700 bg-opacity-60 border-gray-600 text-gray-300 hover:bg-gray-600"
            onClick={handleReturnToHome}
          >
            {currentPlayer?.isHost ? "Cancel" : "Leave Lobby"}
          </Button>
          <Button
            className={`h-10 px-8 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-md transition-all text-base ${
              canStartGame
                ? "opacity-100 hover:from-red-500 hover:to-red-600"
                : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!canStartGame}
            onClick={handleCreateGame}
          >
            Start Game
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LobbyScreen;
