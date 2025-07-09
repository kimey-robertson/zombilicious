import { Player } from "../../../shared/types";
import { usePlayerStore } from "../store/usePlayerStore";

export const useUpdatePlayerState = () => {
  const setActionsRemaining = usePlayerStore(
    (state) => state.setActionsRemaining
  );
  const setIsMyTurn = usePlayerStore((state) => state.setIsMyTurn);

  return (player: Player | undefined) => {
    if (!player) return;

    setActionsRemaining(player.actionsRemaining || 0);
    setIsMyTurn(player.myTurn || false);
  };
};
