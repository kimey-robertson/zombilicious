import { Card, CardContent } from "../UI/Card";

const PlayerCards = () => {
  const reserveCards = [
    { id: 1, name: "Goalie Mask", type: "Equipment", condition: "damaged" },
    { id: 2, name: "Gasoline", type: "Supply", condition: "bloodstained" },
    { id: 3, name: "Fire Axe", type: "Weapon", condition: "flickering" },
  ];

  const handCards = [
    { id: 4, name: "Machete", type: "Weapon", condition: "bloodied" },
    { id: 5, name: "Rifle", type: "Weapon", condition: "expired" },
  ];

  return (
    <div className="col-span-2 space-y-3">
      {/* Reserve Cards */}
      <div>
        <h4 className="text-red-400 font-bold text-center tracking-wider border-b border-red-900/50 pb-2 mb-3 font-mono">
          Player Cards
        </h4>
        <div className="flex justify-center gap-2">
          {reserveCards.map((card) => (
            <Card
              key={card.id}
              className="bg-gradient-to-b from-stone-800/70 to-stone-900/90 border-2 border-red-800/40 w-28 h-36 cursor-pointer hover:scale-105 transition-all duration-300 hover:border-red-600/60 shadow-lg relative overflow-hidden"
            >
              <CardContent className="p-3 text-center flex flex-col justify-between h-full relative">
                {/* Blood stain effects */}
                {/* <div className="absolute top-1 right-2 w-2 h-2 bg-red-900/50 rounded-full blur-sm" />
                {card.condition === "bloodstained" && (
                  <div className="absolute bottom-2 left-1 w-3 h-2 bg-red-900/40 rounded-full blur-sm" />
                )} */}

                <div className="text-xs font-bold text-stone-300 font-mono">
                  {card.name}
                </div>
                <div className="text-xs text-stone-500">{card.type}</div>
                {/* <div className="text-xs text-red-500 italic font-mono">
                  {card.condition}
                </div> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Hand Cards */}
      <div>
        {/* <h4 className="text-red-400 font-bold text-center tracking-wider border-b border-red-900/50 pb-2 mb-3 font-mono">
          IN HAND
        </h4> */}
        <div
          className="flex justify-center gap-2"
          style={{ marginTop: "-40px" }}
        >
          {handCards.map((card) => (
            <Card
              key={card.id}
              className="bg-gradient-to-b from-red-950/80 to-black/90 border-2 border-red-700/60 w-32 h-40 cursor-pointer hover:scale-110 transition-all duration-300 hover:border-red-500/80 shadow-xl relative overflow-hidden"
            >
              <CardContent className="p-4 text-center flex flex-col justify-between h-full relative">
                {/* Blood effects */}
                <div className="absolute top-1 left-1 w-3 h-3 bg-red-900/40 rounded-full blur-sm" />
                {/* {card.condition === "bloodied" && (
                  <div className="absolute bottom-3 right-2 w-2 h-2 bg-red-800/60 rounded-full blur-sm" />
                )} */}

                <div className="text-sm font-bold text-red-200 font-mono">
                  {card.name}
                </div>
                <div className="text-xs text-stone-400">{card.type}</div>
                {/* <div className="text-xs text-red-400 italic font-semibold font-mono">
                  {card.condition}
                </div> */}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerCards;
