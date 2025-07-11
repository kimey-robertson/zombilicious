import { usePlayerStore } from "../../store/usePlayerStore";
import { Card, CardContent } from "../UI/Card";
import { useCardDragAndDrop } from "../../hooks/useCardDragAndDrop";
import { Card as CardType } from "../../../../shared/types";

const PlayerCards = () => {
  const reserveCards = usePlayerStore((state) => state.playerCards.inReserve);
  const handCards = usePlayerStore((state) => state.playerCards.inHand);

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
    cardType: "reserve" | "hand",
    index: number,
    isInHand: boolean = false
  ) => {
    const isEmpty = !card;
    const isDragging = draggedCard?.cardId === card?.id;
    const isDropTarget =
      dragOverTarget?.targetType === cardType &&
      dragOverTarget?.targetIndex === index;
    const isValidTarget = isValidDropTarget(cardType, index);

    return (
      <Card
        key={card?.id || `${cardType}-${index}`}
        className={`
          ${
            isInHand
              ? "bg-gradient-to-b from-red-950/80 to-black/90 border-2 border-red-700/60 w-32 h-40 hover:scale-110"
              : "bg-gradient-to-b from-stone-800/70 to-stone-900/90 border-2 border-red-800/40 w-28 h-36 hover:scale-105"
          }
          transition-all duration-300 shadow-xl relative overflow-hidden
          ${isDragging ? "opacity-50 rotate-3 scale-105" : ""}
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
          ${isEmpty ? "cursor-default" : "cursor-grab active:cursor-grabbing"}
          ${
            draggedCard && isEmpty && isValidTarget
              ? "border-blue-500/60 bg-blue-900/10 border-dashed"
              : ""
          }
        `}
        draggable={!isEmpty}
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
        <CardContent
          className={`${
            isInHand ? "p-4" : "p-3"
          } text-center flex flex-col justify-between h-full relative`}
        >
          {/* Visual indicator for hand cards */}
          {card && isInHand && (
            <div className="absolute top-1 left-1 w-3 h-3 bg-red-900/40 rounded-full blur-sm" />
          )}

          {/* Card content */}
          {card ? (
            <div
              className={`${isInHand ? "text-sm" : "text-xs"} font-bold ${
                isInHand ? "text-red-200" : "text-stone-300"
              } font-mono`}
            >
              {card.name}
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
                <div className="mt-1 text-xs text-blue-300/70 font-mono">↓</div>
              )}
            </div>
          )}

          {/* Drag handle indicator */}
          {card && !isDragging && (
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
      </Card>
    );
  };

  return (
    <div className="col-span-2 space-y-3">
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
        </div>
      </div>

      {/* Drag Instructions */}
      {draggedCard && (
        <div className="text-center">
          <div className="text-xs text-stone-400 font-mono opacity-75">
            Drop on empty slot to move • Drop on occupied slot to swap
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerCards;
