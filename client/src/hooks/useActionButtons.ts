import { SocketResponse } from "../../../shared/types";
import { ActionType } from "../../../shared/types";
import { GameAction } from "../components/Overlay/ActionButtons";
import { useGameStore } from "../store/useGameStore";
import { usePlayerStore } from "../store/usePlayerStore";
import { useCurrentPlayer } from "./useCurrentPlayer";
import { getSocket } from "../socket";

import { useHandleError } from "./useHandleError";

export const useActionButtons = () => {
  const socket = getSocket();
  const handleError = useHandleError();

  const gameId = useGameStore((state) => state.gameId);
  const map = useGameStore((state) => state.map);

  const playerCards = usePlayerStore((state) => state.playerCards);
  const selectedAction = usePlayerStore((state) => state.selectedAction);
  const setSelectedAction = usePlayerStore((state) => state.setSelectedAction);
  const setPlayerCards = usePlayerStore((state) => state.setPlayerCards);
  const setSelectedCardForRanged = usePlayerStore(
    (state) => state.setSelectedCardForRanged
  );

  const { currentPlayer, canPerformAction, currentZone } = useCurrentPlayer();

  const isCurrentPlayerNextToClosedDoor = map.doors.some(
    (door) =>
      (currentPlayer?.currentZoneId.includes(door.cellIds[0]) ||
        currentPlayer?.currentZoneId.includes(door.cellIds[1])) &&
      door.state === "closed"
  );

  const buttonDisabled = (actionId: ActionType) => {
    return (
      !canPerformAction ||
      (actionId === "search" &&
        (currentPlayer?.searchedThisTurn || !currentZone?.room)) ||
      (actionId === "door" &&
        (!isCurrentPlayerNextToClosedDoor ||
          !playerCards.inHand.some(
            (card) =>
              card?.canOpenDoorsWithNoise || card?.canOpenDoorsWithoutNoise
          ))) ||
      (actionId === "inventory" &&
        playerCards.inHand.length === 0 &&
        playerCards.inReserve.length === 0) ||
      (actionId === "melee" &&
        (currentZone?.zombies === 0 ||
          !playerCards.inHand.some((card) => card?.maxRange === 0))) ||
      (actionId === "ranged" &&
        !playerCards.inHand.some((card) => card && card.maxRange > 0)) ||
      (actionId === "objective" && !currentZone?.hasObjectiveToken)
    );
  };

  const handleActionButtonClick = (action: GameAction) => {
    if (!canPerformAction) return;

    if (action.id !== "inventory") {
      if (!currentPlayer) return;
      setPlayerCards(currentPlayer.playerCards);
    }

    if (action.id === "ranged") {
      setSelectedCardForRanged(undefined);
    }

    if (action.id === "noise") {
      socket.emit(
        "make-noise",
        {
          gameId,
          zoneId: currentPlayer?.currentZoneId ?? "",
          playerId: currentPlayer?.id ?? "",
        },
        (response: SocketResponse) => {
          if (!response.success) {
            handleError(response.error);
          } else {
            setSelectedAction(undefined);
          }
        }
      );
    } else if (
      action.id === "search" &&
      canPerformAction &&
      !currentPlayer?.searchedThisTurn
    ) {
      const zone = map.zones.find(
        (zone) => zone.id === currentPlayer?.currentZoneId
      );
      if (!zone) {
        return handleError({
          code: "OPERATION_FAILED",
          message: "Zone not found",
        });
      }
      if (!zone.room) return;
      socket.emit(
        "search-for-items",
        {
          gameId,
          zoneId: currentPlayer?.currentZoneId ?? "",
          playerId: currentPlayer?.id ?? "",
        },
        (response: SocketResponse) => {
          if (!response.success) {
            handleError(response.error);
          } else {
            setSelectedAction(undefined);
          }
        }
      );
    } else if (action.id === "objective") {
      socket.emit(
        "take-objective-token",
        {
          gameId,
          zoneId: currentPlayer?.currentZoneId ?? "",
          playerId: currentPlayer?.id ?? "",
        },
        (response: SocketResponse) => {
          if (!response.success) {
            handleError(response.error);
          } else {
            setSelectedAction(undefined);
          }
        }
      );
    }

    if (action.id === selectedAction?.id) {
      setSelectedAction(undefined);
      return;
    }
    setSelectedAction(action);
  };

  return { buttonDisabled, handleActionButtonClick };
};
