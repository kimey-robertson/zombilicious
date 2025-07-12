import { useState, useCallback, useEffect, useRef } from "react";
import { Card } from "../../../shared/types";
import { usePlayerStore } from "../store/usePlayerStore";

export type DragData = {
  cardId: string;
  sourceType: TargetType;
  sourceIndex: number;
};

export type DropResult = {
  targetType: TargetType;
  targetIndex: number;
};

export type TargetType = "reserve" | "hand" | "found";

export const useCardDragAndDrop = () => {
  const [draggedCard, setDraggedCard] = useState<DragData | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<DropResult | null>(null);
  const dragTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const playerCards = usePlayerStore((state) => state.playerCards);
  const setPlayerCards = usePlayerStore((state) => state.setPlayerCards);

  // Cleanup function to reset all drag state
  const cleanupDragState = useCallback(() => {
    setDraggedCard(null);
    setDragOverTarget(null);
    if (dragTimeoutRef.current) {
      clearTimeout(dragTimeoutRef.current);
      dragTimeoutRef.current = null;
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanupDragState();
    };
  }, [cleanupDragState]);

  const handleDragStart = useCallback(
    (
      e: React.DragEvent,
      card: Card,
      sourceType: TargetType,
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

      // Safety timeout to clean up if drag end doesn't fire
      dragTimeoutRef.current = setTimeout(() => {
        cleanupDragState();
      }, 10000); // 10 second timeout
    },
    [cleanupDragState]
  );

  const handleDragEnd = useCallback(
    (e: React.DragEvent) => {
      // Reset visual feedback
      if (e.currentTarget instanceof HTMLElement) {
        e.currentTarget.style.opacity = "1";
      }

      // Clean up drag state
      cleanupDragState();
    },
    [cleanupDragState]
  );

  const handleDragOver = useCallback(
    (e: React.DragEvent, targetType: TargetType, targetIndex: number) => {
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
    (e: React.DragEvent, targetType: TargetType, targetIndex: number) => {
      e.preventDefault();

      // Always clean up drag state first
      cleanupDragState();

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
        const currentSwappableCard = playerCards.swappableCard;

        // Get the card being moved
        let cardToMove: Card | null = null;
        if (dragData.sourceType === "reserve") {
          cardToMove = currentReserve[dragData.sourceIndex];
        } else if (dragData.sourceType === "hand") {
          cardToMove = currentHand[dragData.sourceIndex];
        } else if (dragData.sourceType === "found") {
          cardToMove = currentSwappableCard || null;
        }

        if (!cardToMove) return;

        // Get target card
        let targetCard: Card | null = null;
        if (targetType === "reserve") {
          targetCard = currentReserve[targetIndex];
        } else if (targetType === "hand") {
          targetCard = currentHand[targetIndex];
        } else if (targetType === "found") {
          targetCard = currentSwappableCard || null;
        }

        const isEmptySlot = !targetCard;

        // Create new arrays for the swap/move
        const newReserve = [...currentReserve];
        const newHand = [...currentHand];
        let newSwappableCard = currentSwappableCard;

        if (isEmptySlot) {
          // Moving to empty slot - just move the card
          // Clear source position
          if (dragData.sourceType === "reserve") {
            newReserve[dragData.sourceIndex] = null;
          } else if (dragData.sourceType === "hand") {
            newHand[dragData.sourceIndex] = null;
          } else if (dragData.sourceType === "found") {
            newSwappableCard = null;
          }

          // Place at target position
          if (targetType === "reserve") {
            newReserve[targetIndex] = cardToMove;
          } else if (targetType === "hand") {
            newHand[targetIndex] = cardToMove;
          } else if (targetType === "found") {
            newSwappableCard = cardToMove;
          }
        } else {
          // Occupied slot - SWAP the cards
          const sourceCardToSwap = cardToMove;
          const targetCardToSwap = targetCard;

          // Place source card at target position
          if (targetType === "reserve") {
            newReserve[targetIndex] = sourceCardToSwap;
          } else if (targetType === "hand") {
            newHand[targetIndex] = sourceCardToSwap;
          } else if (targetType === "found") {
            newSwappableCard = sourceCardToSwap;
          }

          // Place target card at source position
          if (dragData.sourceType === "reserve") {
            newReserve[dragData.sourceIndex] = targetCardToSwap;
          } else if (dragData.sourceType === "hand") {
            newHand[dragData.sourceIndex] = targetCardToSwap;
          } else if (dragData.sourceType === "found") {
            newSwappableCard = targetCardToSwap;
          }
        }

        // Update the store with new arrays and swappable card
        setPlayerCards({
          inReserve: newReserve,
          inHand: newHand,
          swappableCard: newSwappableCard,
        });
      } catch (error) {
        console.error("Error handling card drop:", error);
      }
    },
    [playerCards, setPlayerCards, cleanupDragState]
  );

  const isValidDropTarget = useCallback(
    (targetType: TargetType, targetIndex: number) => {
      if (!draggedCard) return false;

      // Can't drop on the same slot
      if (
        draggedCard.sourceType === targetType &&
        draggedCard.sourceIndex === targetIndex
      ) {
        return false;
      }

      // Check if the target index is within valid bounds
      const maxSlots =
        targetType === "reserve"
          ? 3
          : targetType === "hand"
          ? 2
          : targetType === "found"
          ? 1
          : 0;
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
