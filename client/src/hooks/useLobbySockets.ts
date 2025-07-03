import { useEffect, useRef } from "react";
import { getSocket } from "../socket";
import { useLobbyStore } from "../store/useLobbyStore";
import { Game, LobbyPlayer } from "../../../shared/types";
import { toast } from "react-hot-toast";

export const useLobbySockets = () => {
  const socketRef = useRef(getSocket());
  const socket = socketRef.current;

  const setLobbies = useLobbyStore((state) => state.setLobbies);
  const reconnectableGames = useLobbyStore((state) => state.reconnectableGames);
  const setReconnectableGames = useLobbyStore(
    (state) => state.setReconnectableGames
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
    if (games?.length > 0) {
      games.forEach((game) => {
        const playerIdFromLocalStorage = localStorage.getItem("playerId");
        if (
          playerIdFromLocalStorage &&
          game.disconnectedPlayers[playerIdFromLocalStorage]
        ) {
          toast.error("You have been disconnected from the game");
          setReconnectableGames([
            ...reconnectableGames,
            { gameId: game.id, playerId: playerIdFromLocalStorage },
          ]);
        }
      });
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
    return () => {
      // Clean up socket event listeners
      socket.off("connect", handleConnect);
      socket.off("lobby-updated", handleLobbyUpdated);
      socket.off("lobby-deleted", handleLobbyDeleted);
      socket.off(
        "games-with-disconnected-players",
        handleGamesWithDisconnectedPlayers
      );
    };
  });
};
