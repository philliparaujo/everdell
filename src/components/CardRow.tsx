import { Card, PlayerColor } from "../engine/gameTypes";
import { computeMaxCitySize } from "../utils/gameLogic";
import CardPreview from "./CardPreview";

function CardRow({
  cards,
  location,
  cityColor,
  onLeftClick,
  maxLength,
  onDrop,
  isDropTarget = false,
}: {
  cards: Card[];
  location: "hand" | "city" | "meadow" | "reveal" | "discard";
  cityColor: PlayerColor | null;
  onLeftClick: (index: number, card: Card | null) => void;
  maxLength?: number;
  onDrop?: (
    droppedCard: Card,
    sourceLocation: string,
    sourceIndex: number,
    targetIndex: number,
  ) => void;
  isDropTarget?: boolean;
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
            location={location}
            cityColor={cityColor}
            onLeftClick={() => onLeftClick(index, card)}
            onDrop={onDrop}
            isDropTarget={isDropTarget}
          />
        );
      })}
    </div>
  );
}

export default CardRow;
