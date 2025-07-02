import { useEffect, useRef } from "react";
import { getSocket } from "../socket";
import { useLobbyStore } from "../store/useLobbyStore";

export const useLobbySockets = () => {
  const socketRef = useRef(getSocket());
  const setLobbies = useLobbyStore((state) => state.setLobbies);

  useEffect(() => {
    const socket = socketRef.current;

    const handleConnect = () => {
      console.log("connected to server");
    };

    const handleLobbyUpdated = (data: {
      lobbyId: string;
      player: { name: string; id: string; isHost: boolean };
    }) => {
      console.log("lobby updated", data);
      setLobbies((prevLobbies) => {
        return prevLobbies.map((lobby) =>
          lobby.id === data.lobbyId
            ? { ...lobby, players: [...lobby.players, data.player] }
            : lobby
        );
      });
    };

    socket.on("connect", handleConnect);
    socket.on("lobby-updated", handleLobbyUpdated);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("lobby-updated", handleLobbyUpdated);
    };
  }, [setLobbies]);
};
