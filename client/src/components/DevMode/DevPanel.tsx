import { useDevStore } from "../../store/useDevStore";
import { usePlayerStore } from "../../store/usePlayerStore";
import { Button } from "../UI/Button";
import Switch from "../UI/Switch";

const DevPanel = () => {
  const hideOverlay = useDevStore((state) => state.hideOverlay);
  const setHideOverlay = useDevStore((state) => state.setHideOverlay);

  const playerCards = usePlayerStore((state) => state.playerCards);
  const addTestCards = useDevStore((state) => state.addTestCards);
  const clearAllCards = useDevStore((state) => state.clearAllCards);

  // Count non-null cards
  const reserveCount = playerCards.inReserve.filter(
    (card) => card !== null
  ).length;
  const handCount = playerCards.inHand.filter((card) => card !== null).length;
  const totalCards = reserveCount + handCount;

  return (
    <div className="side-panel overlay-item">
      <h3>Dev mode panel</h3>
      <div className="side-panel-detail">
        Hide overlay: <Switch onChange={() => setHideOverlay(!hideOverlay)} />
      </div>

      <div className="side-panel-detail">
        <h4 className="text-sm font-bold text-yellow-400 mb-2">
          Card Drag & Drop Test
        </h4>
        <div className="space-y-2">
          <div className="text-xs text-gray-300">
            Cards: {totalCards} ({reserveCount} reserve, {handCount} hand)
          </div>
          <div className="flex gap-2">
            <Button
              onClick={addTestCards}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Add Test Cards
            </Button>
            <Button
              onClick={clearAllCards}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Clear All
            </Button>
          </div>
          <div className="text-xs text-gray-400">
            • Drag cards between any of the 5 slots • Empty slots can be in any
            position • Cards swap when dropped on occupied slots
          </div>
        </div>
      </div>

      <div className="side-panel-detail"></div>
    </div>
  );
};

export default DevPanel;
