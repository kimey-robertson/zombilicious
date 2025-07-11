import { useState, useCallback } from "react";
import { Card } from "../../../shared/types";
import { usePlayerStore } from "../store/usePlayerStore";

export type DragData = {
  cardId: string;
  sourceType: "reserve" | "hand";
  sourceIndex: number;
};

export type DropResult = {
  targetType: "reserve" | "hand";
  targetIndex: number;
};

export const useCardDragAndDrop = () => {
  const [draggedCard, setDraggedCard] = useState<DragData | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<DropResult | null>(null);

  const playerCards = usePlayerStore((state) => state.playerCards);
  const setPlayerCards = usePlayerStore((state) => state.setPlayerCards);

  const handleDragStart = useCallback(
    (
      e: React.DragEvent,
      card: Card,
      sourceType: "reserve" | "hand",
      sourceIndex: number
    ) => {
      const dragData: DragData = {
        cardId: card.id,
        sourceType,
        sourceIndex,
      };

      setDraggedCard(dragData);
      e.dataTransfer.setData("application/json", JSON.stringify(dragData));
      e.dataTransfer.effectAllowed = "move";

      // Add visual feedback
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.opacity = "0.5";
      }
    },
    []
  );

  const handleDragEnd = useCallback((e: React.DragEvent) => {
    setDraggedCard(null);
    setDragOverTarget(null);

    // Reset visual feedback
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = "1";
    }
  }, []);

  const handleDragOver = useCallback(
    (
      e: React.DragEvent,
      targetType: "reserve" | "hand",
      targetIndex: number
    ) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      setDragOverTarget({ targetType, targetIndex });
    },
    []
  );

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    // Only clear if we're actually leaving the drop zone
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDragOverTarget(null);
    }
  }, []);

  const handleDrop = useCallback(
    (
      e: React.DragEvent,
      targetType: "reserve" | "hand",
      targetIndex: number
    ) => {
      e.preventDefault();
      setDragOverTarget(null);

      try {
        const dragData: DragData = JSON.parse(
          e.dataTransfer.getData("application/json")
        );

        if (!dragData) return;

        // Don't move if dropping on the same slot
        if (
          dragData.sourceType === targetType &&
          dragData.sourceIndex === targetIndex
        ) {
          return;
        }

        // Helper function to ensure array has the right length with null padding
        const ensureArrayLength = (
          arr: (Card | null)[],
          length: number
        ): (Card | null)[] => {
          const result = [...arr];
          while (result.length < length) {
            result.push(null);
          }
          return result;
        };

        // Get current arrays with proper length (3 for reserve, 2 for hand)
        const currentReserve = ensureArrayLength(playerCards.inReserve, 3);
        const currentHand = ensureArrayLength(playerCards.inHand, 2);

        // Get the card being moved
        const sourceArray =
          dragData.sourceType === "reserve" ? currentReserve : currentHand;
        const cardToMove = sourceArray[dragData.sourceIndex];

        if (!cardToMove) return;

        // Get target info
        const targetArray =
          targetType === "reserve" ? currentReserve : currentHand;
        const targetCard = targetArray[targetIndex];
        const isEmptySlot = !targetCard;

        // Create new arrays for the swap/move
        const newReserve = [...currentReserve];
        const newHand = [...currentHand];

        if (isEmptySlot) {
          // Moving to empty slot - just move the card
          // Clear source position
          if (dragData.sourceType === "reserve") {
            newReserve[dragData.sourceIndex] = null;
          } else {
            newHand[dragData.sourceIndex] = null;
          }

          // Place at target position
          if (targetType === "reserve") {
            newReserve[targetIndex] = cardToMove;
          } else {
            newHand[targetIndex] = cardToMove;
          }
        } else {
          // Occupied slot - SWAP the cards
          const sourceCardToSwap = cardToMove;
          const targetCardToSwap = targetCard;

          // Place source card at target position
          if (targetType === "reserve") {
            newReserve[targetIndex] = sourceCardToSwap;
          } else {
            newHand[targetIndex] = sourceCardToSwap;
          }

          // Place target card at source position
          if (dragData.sourceType === "reserve") {
            newReserve[dragData.sourceIndex] = targetCardToSwap;
          } else {
            newHand[dragData.sourceIndex] = targetCardToSwap;
          }
        }

        // Update the store with new arrays (keeping null values for empty slots)
        setPlayerCards({
          inReserve: newReserve,
          inHand: newHand,
        });
      } catch (error) {
        console.error("Error handling card drop:", error);
      }
    },
    [playerCards, setPlayerCards]
  );

  const isValidDropTarget = useCallback(
    (targetType: "reserve" | "hand", targetIndex: number) => {
      if (!draggedCard) return false;

      // Can't drop on the same slot
      if (
        draggedCard.sourceType === targetType &&
        draggedCard.sourceIndex === targetIndex
      ) {
        return false;
      }

      // Check if the target index is within valid bounds
      const maxSlots = targetType === "reserve" ? 3 : 2;
      if (targetIndex >= maxSlots) {
        return false;
      }

      // All slots within bounds are valid targets (empty or occupied)
      return true;
    },
    [draggedCard]
  );

  return {
    draggedCard,
    dragOverTarget,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isValidDropTarget,
  };
};
