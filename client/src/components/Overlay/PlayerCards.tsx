import { usePlayerStore } from "../../store/usePlayerStore";
import { Card, CardContent } from "../UI/Card";

const PlayerCards = () => {
  const reserveCards = usePlayerStore((state) => state.playerCards.inReserve);
  const handCards = usePlayerStore((state) => state.playerCards.inHand);

  // Create fixed number of slots (3 reserve, 2 hand)
  const reserveSlots = 3;
  const handSlots = 2;

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
            return (
              <Card
                key={card?.id || `reserve-${index}`}
                className="bg-gradient-to-b from-stone-800/70 to-stone-900/90 border-2 border-red-800/40 w-28 h-36 cursor-pointer hover:scale-105 transition-all duration-300 hover:border-red-600/60 shadow-lg relative overflow-hidden"
              >
                <CardContent className="p-3 text-center flex flex-col justify-between h-full relative">
                  {card ? (
                    <div className="text-xs font-bold text-stone-300 font-mono">
                      {card.name}
                    </div>
                  ) : (
                    <div className="text-xs text-stone-600 font-mono opacity-50">
                      Empty
                    </div>
                  )}
                </CardContent>
              </Card>
            );
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
            return (
              <Card
                key={card?.id || `hand-${index}`}
                className="bg-gradient-to-b from-red-950/80 to-black/90 border-2 border-red-700/60 w-32 h-40 cursor-pointer hover:scale-110 transition-all duration-300 hover:border-red-500/80 shadow-xl relative overflow-hidden"
              >
                <CardContent className="p-4 text-center flex flex-col justify-between h-full relative">
                  {card && (
                    <div className="absolute top-1 left-1 w-3 h-3 bg-red-900/40 rounded-full blur-sm" />
                  )}

                  {card ? (
                    <div className="text-sm font-bold text-red-200 font-mono">
                      {card.name}
                    </div>
                  ) : (
                    <div className="text-sm text-red-400/50 font-mono opacity-50">
                      Empty
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default PlayerCards;
