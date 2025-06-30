import { useState } from "react";
import { Button } from "../UI/Button";

interface Player {
  id: string;
  name: string;
  isReady: boolean;
  isHost: boolean;
}

interface GameSettings {
  gameName: string;
  maxPlayers: number;
}

const CreateGameScreen = ({
  setCreateGameScreen,
  playerName,
}: {
  setCreateGameScreen: (value: boolean) => void;
  playerName: string;
}) => {
  const [players, setPlayers] = useState<Player[]>([
        { id: "1", name: playerName, isReady: true, isHost: true },
  ]);

  const [settings, setSettings] = useState<GameSettings>({
    gameName: "Zombilicious Game",
    maxPlayers: 6,
  });

  const removePlayer = (playerId: string) => {
    setPlayers(players.filter((p) => p.id !== playerId));
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
                Players ({players.length}/{settings.maxPlayers})
              </h2>
            </div>

            {/* Player List */}
            <div className="space-y-2 mb-4 flex-1 overflow-y-auto">
              {players.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between bg-gray-800 bg-opacity-60 rounded-lg p-3 border border-gray-600 border-opacity-40"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`w-3 h-3 rounded-full 
                        ${player.isReady ? "bg-green-500" : "bg-red-500"}`}
                    />
                    <span className="font-medium">{player.name}</span>
                    {player.isHost && (
                      <span className="px-2 py-1 text-xs bg-yellow-600 bg-opacity-70 rounded-full text-yellow-100">
                        Host
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    {!player.isHost && (
                      <>
                        <Button
                          size="sm"
                          variant={player.isReady ? "destructive" : "default"}
                          className="text-xs"
                        >
                          {player.isReady ? "Unready" : "Ready"}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => removePlayer(player.id)}
                          className="text-xs bg-red-700 hover:bg-red-600"
                        >
                          ✕
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Game Settings - Right Side */}
          <div className="bg-black bg-opacity-40 backdrop-blur-sm rounded-lg p-4 border border-gray-700 border-opacity-50 flex flex-col min-h-0">
            <h2 className="text-xl font-semibold text-yellow-400 mb-4">
              Game Settings
            </h2>

            <div className="space-y-4 flex-1 overflow-y-auto">
              {/* Game Name */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Game Name
                </label>
                <input
                  type="text"
                  value={settings.gameName}
                  onChange={(e) =>
                    setSettings({ ...settings, gameName: e.target.value })
                  }
                  className="w-full bg-gray-700 bg-opacity-60 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>

              {/* Max Players */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Max Players
                </label>
                <select
                  value={settings.maxPlayers}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      maxPlayers: parseInt(e.target.value),
                    })
                  }
                  className="w-full bg-gray-700 bg-opacity-60 border border-gray-600 rounded-md px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  {[2, 3, 4, 5, 6, 8].map((num) => (
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
            onClick={() => setCreateGameScreen(false)}
          >
            Cancel
          </Button>
          <button className="h-10 px-8 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-md transition-all text-base">
            Start Game
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateGameScreen;
