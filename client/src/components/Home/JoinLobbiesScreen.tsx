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
import { getSocket } from "../../socket";
import { Lobby } from "../../../../shared/types";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import LobbyScreen from "./LobbyScreen";
import { usePlayerStore } from "../../store/usePlayerStore";

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

const JoinLobbiesScreen = ({
  setJoinLobbiesScreen,
}: {
  setJoinLobbiesScreen: (value: boolean) => void;
}) => {
  const socket = getSocket();
  const setLobbies = useLobbyStore((state) => state.setLobbies);
  const lobbies = useLobbyStore((state) => state.lobbies);
  const myLobbyId = useLobbyStore((state) => state.myLobbyId);
  const setMyLobbyId = useLobbyStore((state) => state.setMyLobbyId);
  const [joinLobbyLoading, setJoinLobbyLoading] = useState(false);

  const playerName = usePlayerStore((state) => state.playerName);

  const handleJoinLobby = (lobbyId: string) => {
    console.log(`Joining lobby: ${lobbyId}`);
    setJoinLobbyLoading(true);
    const lobby = lobbies.find((lobby) => lobby.id === lobbyId);
    if (lobby) {
      if (lobby.players.length >= 4) {
        toast.error("Lobby is full");
        setJoinLobbyLoading(false);
        return;
      }
    } else {
      toast.error("Lobby not found");
      setJoinLobbyLoading(false);
      return;
    }

    socket.emit(
      "join-lobby",
      { lobbyId, playerName },
      (response: { success: boolean; errorMessage?: string }) => {
        console.log("response", response);
        if (response.success) {
          console.log("Joined lobby successfully");
          setMyLobbyId(lobbyId);
        } else {
          console.log("Failed to join lobby:", response.errorMessage);
          toast.error(response.errorMessage || "Failed to join lobby");
        }
        setJoinLobbyLoading(false);
      }
    );
  };

  const handleReturnToHome = () => {
    setJoinLobbiesScreen(false);
  };

  useEffect(() => {
    socket.emit("fetch-lobbies", (data: { lobbies: Lobby[] }) => {
      setLobbies(data.lobbies);
    });
  }, []);

  if (joinLobbyLoading) {
    return (
      <div className="flex justify-center items-center h-full">
        Joining lobby...
      </div>
    );
  }

  if (myLobbyId) {
    return <LobbyScreen />;
  }

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
                      {lobby.gameName}
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
      <div className="mt-4">
        <Button onClick={handleReturnToHome}>Return to Home</Button>
      </div>
    </div>
  );
};

export default JoinLobbiesScreen;
