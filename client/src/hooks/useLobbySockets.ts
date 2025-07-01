import { useEffect } from "react";
import { socket } from "../socket";

export const useLobbySockets = () => {
  useEffect(() => {
    const handleConnect = () => {
      console.log("connected to server");
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, []);
};
