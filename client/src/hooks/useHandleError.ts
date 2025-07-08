import toast from "react-hot-toast";
import { SocketError } from "../../../shared/types";

export const useHandleError = () => {
  return (error: SocketError | undefined) => {
    if (error) {
      toast.error(error.message);
      console.error(error);
    }
  };
};
