import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardAction,
} from "../UI/Card";
import { Button } from "../UI/Button";
import { useLobbyStore } from "../../store/useLobbyStore";

// Mock data for demonstration - replace with actual lobby data later
// const mockLobbies = [
//   {
//     id: "LOBBY001",
//     gameName: "Zombie Survival Arena",
//     players: 2,
//     maxPlayers: 4,
//   },
//   {
//     id: "LOBBY002",
//     gameName: "Undead Battleground",
//     players: 1,
//     maxPlayers: 6,
//   },
//   { id: "LOBBY003", gameName: "Apocalypse Zone", players: 3, maxPlayers: 4 },
//   {
//     id: "LOBBY004",
//     gameName: "Dead City Challenge",
//     players: 1,
//     maxPlayers: 8,
//   },
// ];

const JoinLobbiesScreen = () => {
  const lobbies = useLobbyStore((state) => state.lobbies);

  const handleJoinLobby = (lobbyId: string) => {
    // TODO: Implement join lobby logic
    console.log(`Joining lobby: ${lobbyId}`);
  };

  return (
    <div className="m-auto p-6 flex flex-col items-center h-[80vh]">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[var(--secondary-color)] mb-2">
          Available Lobbies
        </h1>
      </div>

      {lobbies.length === 0 ? (
        <Card className="text-center py-12 bg-[#c7c7c7cc] ">
          <CardContent>
            <div className="text-black font-bold">
              <h3 className="text-lg font-medium mb-2">No lobbies available</h3>
              <p>
                There are no active lobbies at the moment. Create a new game to
                get started!
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 w-full overflow-y-auto ">
          {lobbies.map((lobby) => (
            <Card
              key={lobby.id}
              className="hover:shadow-md transition-shadow bg-[#c7c7c7cc]"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg text-[var(--primary-color)]">
                      {lobby.name}
                    </CardTitle>
                    <CardDescription className="mt-1 text-white text-[var(--secondary-color)] font-bold">
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
                <div className="flex items-center gap-4 text-sm text-gray-600 font-bold">
                  <span className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Players: {lobby.players.length}
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
    </div>
  );
};

export default JoinLobbiesScreen;
