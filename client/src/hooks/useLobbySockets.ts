import { useEffect, useRef } from "react";
import { getSocket } from "../socket";
import { useLobbyStore } from "../store/useLobbyStore";
import { LobbyPlayer } from "../../../shared/types";

export const useLobbySockets = () => {
  const socketRef = useRef(getSocket());
  const socket = socketRef.current;

  const setLobbies = useLobbyStore((state) => state.setLobbies);

  const handleConnect = () => {
    console.log("connected to server");
  };

  const handleLobbyUpdated = (data: {
    lobbyId: string;
    players: LobbyPlayer[];
  }) => {
    console.log("lobby updated", data);
    setLobbies((prevLobbies) => {
      return prevLobbies.map((lobby) =>
        lobby.id === data.lobbyId ? { ...lobby, players: data.players } : lobby
      );
    });
  };

  const handleLobbyDeleted = (data: { lobbyId: string }) => {
    console.log("lobby deleted", data);
    setLobbies((prevLobbies) =>
      prevLobbies.filter((lobby) => lobby.id !== data.lobbyId)
    );
  };

  useEffect(() => {
    // Register socket event listeners
    socket.on("connect", handleConnect);
    socket.on("lobby-updated", handleLobbyUpdated);
    socket.on("lobby-deleted", handleLobbyDeleted);
    return () => {
      // Clean up socket event listeners
      socket.off("connect", handleConnect);
      socket.off("lobby-updated", handleLobbyUpdated);
      socket.off("lobby-deleted", handleLobbyDeleted);
    };
  });
};
