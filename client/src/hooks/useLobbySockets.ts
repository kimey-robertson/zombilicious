import { useEffect, useRef } from "react";
import { getSocket } from "../socket";

export const useLobbySockets = () => {
  const socketRef = useRef(getSocket());
  useEffect(() => {
    const socket = socketRef.current;

    const handleConnect = () => {
      console.log("connected to server");
    };

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, []);
};
