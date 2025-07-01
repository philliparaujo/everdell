import { Card, PlayerColor } from "../engine/gameTypes";
import { computeMaxCitySize } from "../utils/gameLogic";
import CardPreview from "./CardPreview";

function CardRow({
  cards,
  placedDown,
  cityColor,
  onLeftClick,
  maxLength,
}: {
  cards: Card[];
  placedDown: boolean;
  cityColor: PlayerColor | null;
  onLeftClick: (index: number, card: Card | null) => void;
  maxLength?: number;
}) {
  const rowLength = maxLength ?? computeMaxCitySize(cards);

  return (
    <div className="flex overflow-y-hidden scrollbar-thin w-full gap-1 px-0 py-1 rounded-[4px]">
      {Array.from({ length: rowLength }).map((_, index) => {
        const card = cards[index] ?? null;

        return (
          <CardPreview
            key={index}
            index={index}
            card={card}
            placedDown={placedDown}
            cityColor={cityColor}
            onLeftClick={() => onLeftClick(index, card)}
          />
        );
      })}
    </div>
  );
}

export default CardRow;
