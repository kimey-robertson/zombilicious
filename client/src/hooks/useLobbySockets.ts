import { useEffect } from "react";
import { socket } from "../socket";
import { Lobby } from "../../../shared/types";
import { useLobbyStore } from "../store/useLobbyStore";

export const useLobbySockets = () => {
  const { setLobbyId, setLobbyName, setLobbyPlayers } = useLobbyStore();
  useEffect(() => {
    const handleConnect = () => {
      console.log("connected to server");
    };

    const handleLobbyCreated = (lobby: Lobby) => {
      console.log("lobby created", lobby);
      setLobbyId(lobby.id);
      setLobbyName(lobby.name);
      setLobbyPlayers(lobby.players);
    };

    socket.on("connect", handleConnect);
    socket.on("lobby-created", handleLobbyCreated);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("lobby-created", handleLobbyCreated);
    };
  }, [setLobbyId, setLobbyName, setLobbyPlayers]);
};
