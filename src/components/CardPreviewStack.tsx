import { Card, PlayerColor } from "../engine/gameTypes";
import CardPreview from "./CardPreview";
import CardPreviewBottom from "./CardPreviewBottom";

function CardPreviewStack({
  cards,
  index,
  location,
  cityColor,
  onLeftClick,
  onDrop,
}: {
  cards: Card[] | null;
  index: number;
  location: "hand" | "city" | "meadow" | "reveal" | "discard" | "legends";
  cityColor: PlayerColor | null;
  onLeftClick: (index: number, card: Card | null) => void;
  onDrop: (
    droppedCard: Card,
    sourceLocation: string,
    sourceIndex: number,
    targetIndex: number,
  ) => void;
}) {
  return (
    <div className="flex flex-1 overflow-y-hidden">
      <div className="flex flex-col overflow-x-hidden h-full rounded-[4px]">
        <CardPreview
          card={cards?.[0] ?? null}
          index={index}
          location={location}
          cityColor={cityColor}
          onLeftClick={() => onLeftClick(index, cards?.[0] ?? null)}
          onDrop={onDrop}
          isDropTarget={false}
        />
        {cards
          ?.slice(1)
          .map((card, index) => (
            <CardPreviewBottom
              card={card}
              index={index}
              location={location}
              cityColor={cityColor}
              onLeftClick={() => onLeftClick(index, card)}
            />
          ))}
      </div>
    </div>
  );
}
export default CardPreviewStack;
