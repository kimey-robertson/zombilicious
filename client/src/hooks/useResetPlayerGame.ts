import { Player } from "../../../shared/types";
import { usePlayerStore } from "../store/usePlayerStore";

export const useResetPlayerGame = () => {
  const setActionsRemaining = usePlayerStore(
    (state) => state.setActionsRemaining
  );
  const setTotalActions = usePlayerStore((state) => state.setTotalActions);

  return (player: Player | undefined) => {
    console.log("resetting player game", player);

    setActionsRemaining(player?.actionsRemaining || 3);
    setTotalActions(player?.totalActions || 3);
  };
};
