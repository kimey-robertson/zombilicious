import { useEffect, useRef } from "react";
import { getSocket } from "../socket";
import { useLobbyStore } from "../store/useLobbyStore";
import { Game, LobbyPlayer } from "../../../shared/types";
import { useGameStore } from "../store/useGameStore";

export const useLobbySockets = () => {
  const socketRef = useRef(getSocket());
  const socket = socketRef.current;

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

  useEffect(() => {
    // Register socket event listeners
    socket.on("connect", handleConnect);
    socket.on("lobby-updated", handleLobbyUpdated);
    socket.on("lobby-deleted", handleLobbyDeleted);
    socket.on(
      "games-with-disconnected-players",
      handleGamesWithDisconnectedPlayers
    );
    socket.on("player-removed-from-game", handlePlayerRemovedFromGame);
    return () => {
      // Clean up socket event listeners
      socket.off("connect", handleConnect);
      socket.off("lobby-updated", handleLobbyUpdated);
      socket.off("lobby-deleted", handleLobbyDeleted);
      socket.off(
        "games-with-disconnected-players",
        handleGamesWithDisconnectedPlayers
      );
      socket.off("player-removed-from-game", handlePlayerRemovedFromGame);
    };
  });
};
