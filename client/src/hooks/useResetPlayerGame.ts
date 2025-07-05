import { Player } from "../../../shared/types";
import { usePlayerStore } from "../store/usePlayerStore";

export const useResetPlayerGame = () => {
  const setActionsRemaining = usePlayerStore(
    (state) => state.setActionsRemaining
  );
  const setTotalActions = usePlayerStore((state) => state.setTotalActions);
  const setXP = usePlayerStore((state) => state.setXP);
  const setPlayerCards = usePlayerStore((state) => state.setPlayerCards);

  return (player: Player | undefined) => {
    console.log("resetting player game", player);

    setActionsRemaining(player?.actionsRemaining || 3);
    setTotalActions(player?.totalActions || 3);
    setXP(player?.XP || 0);
    setPlayerCards(player?.playerCards || { inReserve: [], inHand: [] });
  };
};
