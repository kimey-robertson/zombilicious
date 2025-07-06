import { useEffect, useRef } from "react";
import { getSocket } from "../socket";
import { useLobbyStore } from "../store/useLobbyStore";
import { Game, Lobby, LobbyPlayer } from "../../../shared/types";
import { useGameStore } from "../store/useGameStore";
import { usePlayerStore } from "../store/usePlayerStore";
import { toast } from "react-hot-toast";

export const useLobbySockets = () => {
  const socketRef = useRef(getSocket());
  const socket = socketRef.current;

  const playerId = usePlayerStore((state) => state.playerId);

  const lobbies = useLobbyStore((state) => state.lobbies);
  const myLobbyId = useLobbyStore((state) => state.myLobbyId);
  const setMyLobbyId = useLobbyStore((state) => state.setMyLobbyId);
  const setLobbies = useLobbyStore((state) => state.setLobbies);
  const setReconnectableGames = useLobbyStore(
    (state) => state.setReconnectableGames
  );
  const setDisconnectTimers = useGameStore(
    (state) => state.setDisconnectTimers
  );

  const handleConnect = () => {
    console.log("connected to server");
  };

  const handleLobbyCreated = ({ lobby }: { lobby: Lobby }) => {
    if (lobby) {
      setLobbies([...lobbies, lobby]);
      if (lobby.players.find((player) => player.id === playerId)) {
        console.log("setting my lobby id", lobby.id);
        setMyLobbyId(lobby.id);
      }
    }
  };

  const handleLobbyUpdated = (data: {
    lobbyId: string;
    gameName: string;
    players: LobbyPlayer[];
  }) => {
    console.log("lobby updated", data);
    setLobbies((prevLobbies) => {
      return prevLobbies.map((lobby) =>
        lobby.id === data.lobbyId
          ? {
              ...lobby,
              gameName: data.gameName,
              players: data.players,
            }
          : lobby
      );
    });
  };

  const handleLobbyDeleted = (data: { lobbyId: string }) => {
    console.log("lobby deleted", data);
    setLobbies((prevLobbies) =>
      prevLobbies.filter((lobby) => lobby.id !== data.lobbyId)
    );
    if (data.lobbyId === myLobbyId) {
      setMyLobbyId("");
      toast.error("Lobby was deleted");
    }
  };

  const handleGamesWithDisconnectedPlayers = (games: Game[]) => {
    setReconnectableGames(games);
  };

  const handlePlayerRemovedFromGame = (playerId: string) => {
    console.log("player removed from game", playerId);
    setDisconnectTimers((prev) => {
      delete prev[playerId];
      return prev;
    });
    if (playerId === localStorage.getItem("playerId")) {
      localStorage.removeItem("playerId");
    }
  };

  const handleLobbiesFetched = ({ allLobbies }: { allLobbies: Lobby[] }) => {
    setLobbies(allLobbies);
  };

  useEffect(() => {
    // Register socket event listeners
    socket.on("connect", handleConnect);
    socket.on("lobby-created", handleLobbyCreated);
    socket.on("lobby-updated", handleLobbyUpdated);
    socket.on("lobby-deleted", handleLobbyDeleted);
    socket.on("lobbies-fetched", handleLobbiesFetched);
    socket.on(
      "games-with-disconnected-players",
      handleGamesWithDisconnectedPlayers
    );
    socket.on("player-removed-from-game", handlePlayerRemovedFromGame);
    return () => {
      // Clean up socket event listeners
      socket.off("connect", handleConnect);
      socket.off("lobby-created", handleLobbyCreated);
      socket.off("lobby-updated", handleLobbyUpdated);
      socket.off("lobby-deleted", handleLobbyDeleted);
      socket.off("lobbies-fetched", handleLobbiesFetched);
      socket.off(
        "games-with-disconnected-players",
        handleGamesWithDisconnectedPlayers
      );
      socket.off("player-removed-from-game", handlePlayerRemovedFromGame);
    };
  });
};
