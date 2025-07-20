import { useGame } from "../engine/GameContext";
import { Card, PlayerColor } from "../engine/gameTypes";
import { groupCardsByBelow } from "../utils/card";
import { computeMaxCitySize } from "../utils/gameLogic";
import { sortCity, sortGroupedCards } from "../utils/loops";
import CardPreview from "./CardPreview";
import CardPreviewStack from "./CardPreviewStack";

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
  location:
    | "hand"
    | "city"
    | "meadow"
    | "reveal"
    | "discard"
    | "farmStack"
    | "legends";
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
  const { game } = useGame();

  // Rendering everything but a city
  if (location !== "city" || !cityColor || !onDrop) {
    const rowLength = maxLength ?? cards.length;
    return (
      <div className="flex overflow-y-hidden scrollbar-thin w-full pr-1 gap-1 rounded-[4px]">
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

  const rowLength = computeMaxCitySize(cards, game.players[cityColor].power);

  const indexedCards: { card: Card; index: number }[] = cards.map(
    (card, index) => ({
      card,
      index,
    }),
  );
  const groupedCards: { card: Card; index: number }[][] =
    groupCardsByBelow(indexedCards);
  const sortedGroupedCards = sortGroupedCards(groupedCards);

  const numGroupedCards = sortedGroupedCards.reduce(
    (acc, group) => acc + group.length,
    0,
  );

  return (
    <div className="flex overflow-y-hidden scrollbar-thin w-full gap-1 rounded-[4px]">
      {sortedGroupedCards.map((group, slotIndex) => (
        <CardPreviewStack
          key={slotIndex}
          cards={group.map(({ card }) => card)}
          indices={group.map(({ index }) => index)}
          location="city"
          cityColor={cityColor}
          onLeftClick={onLeftClick}
          onDrop={onDrop}
          isDropTarget={isDropTarget}
        />
      ))}
      {Array.from({ length: rowLength - numGroupedCards }).map((_, index) => (
        <CardPreview
          key={index}
          index={numGroupedCards + index}
          card={null}
          location="city"
          cityColor={cityColor}
          onLeftClick={() => onLeftClick(numGroupedCards + index, null)}
          onDrop={onDrop}
          isDropTarget={isDropTarget}
        />
      ))}
    </div>
  );
}

export default CardRow;
