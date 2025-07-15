import { usePlayerStore } from "../../store/usePlayerStore";
import { Card, CardContent } from "../UI/Card";
import { TargetType, useCardDragAndDrop } from "../../hooks/useCardDragAndDrop";
import { Card as CardType, SocketResponse } from "../../../../shared/types";
import { Button } from "../UI/Button";
import { FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import { useGameStore } from "../../store/useGameStore";
import { getSocket } from "../../socket";
import { useCurrentPlayer } from "../../hooks/useCurrentPlayer";
import { useHandleError } from "../../hooks/useHandleError";

const PlayerCards = () => {
  const socket = getSocket();
  const handleError = useHandleError();
  const reserveCards = usePlayerStore((state) => state.playerCards.inReserve);
  const handCards = usePlayerStore((state) => state.playerCards.inHand);
  const swappableCard = usePlayerStore(
    (state) => state.playerCards.swappableCard
  );
  const setPlayerCards = usePlayerStore((state) => state.setPlayerCards);
  const selectedAction = usePlayerStore((state) => state.selectedAction);
  const setSelectedAction = usePlayerStore((state) => state.setSelectedAction);

  const gameId = useGameStore((state) => state.gameId);

  const { currentPlayer, canPerformAction } = useCurrentPlayer();

  const {
    draggedCard,
    dragOverTarget,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    isValidDropTarget,
  } = useCardDragAndDrop();

  // Create fixed number of slots (3 reserve, 2 hand)
  const reserveSlots = 3;
  const handSlots = 2;

  const renderCard = (
    card: CardType | null | undefined,
    cardType: TargetType,
    index: number,
    isInHand: boolean = false
  ) => {
    const isEmpty = !card;
    const isDragging = draggedCard?.cardId === card?.id;
    const isDropTarget =
      dragOverTarget?.targetType === cardType &&
      dragOverTarget?.targetIndex === index;
    const isValidTarget = isValidDropTarget(cardType, index);

    const handleDiscardSwappableCard = () => {
      if (!canPerformAction || !currentPlayer || !swappableCard) return;
      socket.emit(
        "discard-swappable-card",
        {
          gameId: gameId,
          playerId: currentPlayer.id,
          playerCards: {
            inReserve: reserveCards,
            inHand: handCards,
            swappableCard,
          },
        },
        (response: SocketResponse) => {
          if (!response.success) {
            handleError(response.error);
          }
        }
      );
    };

    const canDrag = !!swappableCard || selectedAction?.id === "inventory";

    const renderCardStats = (card: CardType) => {
      const hasStats =
        card.damage ||
        card.minRange !== undefined ||
        card.canOpenDoorsWithoutNoise ||
        card.canOpenDoorsWithNoise ||
        card.numberOfDice ||
        card.createsNoiseWhenAttacking !== undefined;
      if (!hasStats) return null;

      return (
        <div className={`${isInHand ? "mt-1" : "mt-1"} space-y-0.5`}>
          {/* Row 1: Damage and Range */}
          {(card.damage ||
            card.minRange !== undefined ||
            card.maxRange !== undefined) && (
            <div className="flex items-center justify-center gap-1">
              {card.damage && (
                <span
                  className={`${
                    isInHand ? "text-xs" : "text-xs"
                  } font-mono text-red-300 bg-red-950/60 px-1 py-0.5 rounded border border-red-800/40`}
                >
                  ⚔ {card.damage}
                </span>
              )}
              {(card.minRange !== undefined || card.maxRange !== undefined) && (
                <span
                  className={`${
                    isInHand ? "text-xs" : "text-xs"
                  } font-mono text-amber-300 bg-amber-950/60 px-1 py-0.5 rounded border border-amber-800/40`}
                >
                  📏 {card.minRange ?? 0}
                  {card.minRange === card.maxRange
                    ? null
                    : `→${card.maxRange ?? "∞"}`}
                </span>
              )}
            </div>
          )}

          {/* Row 2: Dice and Target */}
          {(card.numberOfDice || card.rollRequired) && (
            <div className="flex items-center justify-center gap-1">
              {card.numberOfDice && (
                <span
                  className={`${
                    isInHand ? "text-xs" : "text-xs"
                  } font-mono text-blue-300 bg-blue-950/60 px-1 py-0.5 rounded border border-blue-800/40`}
                >
                  🎲 {card.numberOfDice}
                </span>
              )}
              {card.rollRequired && (
                <span
                  className={`${
                    isInHand ? "text-xs" : "text-xs"
                  } font-mono text-purple-300 bg-purple-950/60 px-1 py-0.5 rounded border border-purple-800/40`}
                >
                  🎯 {card.rollRequired}+
                </span>
              )}
            </div>
          )}

          {/* Row 3: Attack Silence */}
          {card.createsNoiseWhenAttacking !== undefined && (
            <div className="flex items-center justify-center gap-1">
              <span
                className={`${isInHand ? "text-xs" : "text-xs"} font-mono ${
                  !card.createsNoiseWhenAttacking
                    ? "text-green-300 bg-green-950/60 border-green-800/40"
                    : "text-orange-300 bg-orange-950/60 border-orange-800/40"
                } px-1 py-0.5 rounded border`}
              >
                🔇 {!card.createsNoiseWhenAttacking ? "Silent" : "Loud"}
              </span>
            </div>
          )}

          {/* Row 4: Door abilities */}
          {(card.canOpenDoorsWithoutNoise || card.canOpenDoorsWithNoise) && (
            <div className="flex items-center justify-center gap-1">
              <span
                className={`${isInHand ? "text-xs" : "text-xs"} font-mono ${
                  card.canOpenDoorsWithoutNoise
                    ? "text-green-300 bg-green-950/60 border-green-800/40"
                    : "text-yellow-300 bg-yellow-950/60 border-yellow-800/40"
                } px-1 py-0.5 rounded border`}
              >
                🚪 {card.canOpenDoorsWithoutNoise ? "Silent" : "Loud"}
              </span>
            </div>
          )}
        </div>
      );
    };

    return (
      <>
        <Card
          key={card?.id || `${cardType}-${index}`}
          className={`
          ${
            isInHand
              ? "bg-gradient-to-b from-red-950/80 to-black/90 border-2 border-red-700/60 w-32 h-40 hover:scale-110"
              : "bg-gradient-to-b from-stone-800/70 to-stone-900/90 border-2 border-red-800/40 w-28 h-36 hover:scale-105"
          }
          transition-all duration-300 shadow-xl relative overflow-hidden
          ${isDragging ? "opacity-50 scale-105" : ""}
          ${
            isDropTarget && isValidTarget
              ? "border-green-500/80 bg-green-900/20 scale-110"
              : ""
          }
          ${
            isDropTarget && !isValidTarget
              ? "border-red-500/80 bg-red-900/20"
              : ""
          }
          ${
            isEmpty || !canDrag
              ? "cursor-default"
              : "cursor-grab active:cursor-grabbing"
          }
          ${
            draggedCard && isEmpty && isValidTarget
              ? "border-blue-500/60 bg-blue-900/10 border-dashed"
              : ""
          }
        `}
          draggable={!isEmpty && canDrag}
          onDragStart={
            card ? (e) => handleDragStart(e, card, cardType, index) : undefined
          }
          onDragEnd={card ? handleDragEnd : undefined}
          // Important: ALL slots (empty and filled) need these handlers to accept drops
          onDragOver={(e) => handleDragOver(e, cardType, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, cardType, index)}
          // Prevent default dragOver behavior on empty slots too
          onDragEnter={(e) => e.preventDefault()}
        >
          <CardContent className="text-center flex flex-col justify-between h-full relative">
            {/* Visual indicator for hand cards */}
            {card && isInHand && (
              <div className="absolute top-1 left-1 w-3 h-3 bg-red-900/40 rounded-full blur-sm" />
            )}

            {/* Card content */}
            {card ? (
              <div className="flex flex-col h-full">
                <div
                  className={`${isInHand ? "text-sm" : "text-xs"} font-bold ${
                    isInHand ? "text-red-200" : "text-stone-300"
                  } font-mono select-none mb-1`}
                >
                  {card.name}
                </div>
                {renderCardStats(card)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full">
                <div
                  className={`${isInHand ? "text-sm" : "text-xs"} ${
                    isInHand ? "text-red-400/50" : "text-stone-600"
                  } font-mono opacity-50`}
                >
                  {draggedCard && isValidTarget ? "Drop here" : "Empty"}
                </div>
                {draggedCard && isValidTarget && (
                  <div className="mt-1 text-xs text-blue-300/70 font-mono">
                    ↓
                  </div>
                )}
              </div>
            )}

            {/* Drag handle indicator */}
            {card && !isDragging && cardType !== "found" && (
              <div className="absolute top-2 right-2 text-xs opacity-30 hover:opacity-60 transition-opacity">
                <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor">
                  <circle cx="2" cy="2" r="0.5" />
                  <circle cx="6" cy="2" r="0.5" />
                  <circle cx="2" cy="6" r="0.5" />
                  <circle cx="6" cy="6" r="0.5" />
                </svg>
              </div>
            )}
          </CardContent>

          {/* Trash icon for found cards - positioned relative to Card, not CardContent */}
          {card && cardType === "found" && !isDragging && (
            <div className="absolute top-2 right-2">
              <FaTrash
                className="text-red-700 cursor-pointer hover:text-red-500 transition-colors text-sm"
                onClick={handleDiscardSwappableCard}
              />
            </div>
          )}
        </Card>
      </>
    );
  };

  const handleOrganiseInventory = () => {
    if (!canPerformAction || !currentPlayer) return;
    socket.emit(
      "organise-inventory",
      {
        gameId: gameId,
        playerId: currentPlayer.id,
        playerCards: {
          inReserve: reserveCards,
          inHand: handCards,
        },
      },
      (response: SocketResponse) => {
        if (!response.success) {
          handleError(response.error);
        }
      }
    );
    setSelectedAction(undefined);
  };

  const handleCancelOrganiseInventory = () => {
    if (!currentPlayer) return;
    setPlayerCards(currentPlayer.playerCards);
    setSelectedAction(undefined);
  };

  return (
    <div className="space-y-4 relative">
      {/* Found Card */}
      <div className="flex justify-center gap-2 absolute bottom-66 space-y-4 w-full">
        {swappableCard ? renderCard(swappableCard, "found", 0, false) : null}
      </div>

      {/* Reserve Cards */}
      <div>
        <h4 className="text-red-400 font-bold text-center tracking-wider border-b border-red-900/50 pb-2 mb-3 font-mono">
          Player Cards
        </h4>
        <div className="flex justify-center gap-2">
          {Array.from({ length: reserveSlots }, (_, index) => {
            const card = reserveCards[index];
            return renderCard(card, "reserve", index, false);
          })}
        </div>
      </div>

      {/* Hand Cards */}
      <div>
        <div
          className="flex justify-center gap-2"
          style={{ marginTop: "-40px" }}
        >
          {Array.from({ length: handSlots }, (_, index) => {
            const card = handCards[index];
            return renderCard(card, "hand", index, true);
          })}
          {selectedAction?.id === "inventory" && (
            <div className="absolute m-0 gap-0">
              <div className="absolute top-10 left-40 w-10 h-10">
                <Button onClick={handleOrganiseInventory} className="mb-1 p-0">
                  <FaCheck />
                </Button>
                <Button onClick={handleCancelOrganiseInventory}>
                  <FaTimes />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlayerCards;
