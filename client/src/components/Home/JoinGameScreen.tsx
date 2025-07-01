import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "../UI/Card";
import { Button } from "../UI/Button";

// Mock data for demonstration - replace with actual lobby data later
const mockLobbies = [
  {
    id: "LOBBY001",
    gameName: "Zombie Survival Arena",
    players: 2,
    maxPlayers: 4,
  },
  {
    id: "LOBBY002",
    gameName: "Undead Battleground",
    players: 1,
    maxPlayers: 6,
  },
  { id: "LOBBY003", gameName: "Apocalypse Zone", players: 3, maxPlayers: 4 },
  {
    id: "LOBBY004",
    gameName: "Dead City Challenge",
    players: 1,
    maxPlayers: 8,
  },
];

const JoinGameScreen = () => {
  const handleJoinLobby = (lobbyId: string) => {
    // TODO: Implement join lobby logic
    console.log(`Joining lobby: ${lobbyId}`);
  };

  return (
    <div className="m-auto p-6 flex flex-col items-center h-[80vh]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white mb-2">
          Available Lobbies
        </h1>
        <p className="text-gray-600">
          Choose a lobby to join and start playing!
        </p>
      </div>

      {mockLobbies.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <div className="text-gray-500">
              <h3 className="text-lg font-medium mb-2">No lobbies available</h3>
              <p>
                There are no active lobbies at the moment. Create a new game to
                get started!
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 w-full">
          {mockLobbies.map((lobby) => (
            <Card key={lobby.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{lobby.gameName}</CardTitle>
                    <CardDescription className="mt-1">
                      Lobby ID:{" "}
                      <span className="font-mono font-medium">{lobby.id}</span>
                    </CardDescription>
                  </div>
                  <CardAction>
                    <Button
                      onClick={() => handleJoinLobby(lobby.id)}
                      variant="default"
                      size="sm"
                    >
                      Join
                    </Button>
                  </CardAction>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Players: {lobby.players}/{lobby.maxPlayers}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    Status: Waiting
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-8 text-center">
        <Button variant="outline" size="lg">
          Refresh Lobbies
        </Button>
      </div>
    </div>
  );
};

export default JoinGameScreen;
