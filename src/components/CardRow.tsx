import { Card, PlayerColor } from "../engine/gameTypes";
import { maxCitySize } from "../engine/helpers";
import { cardRowStyle } from "../screens/Game";
import CardPreview from "./CardPreview";

function CardRow(
  {
    cards,
    placedDown,
    cityColor,
    onLeftClick,
    maxLength,
  }: {
    cards: Card[],
    placedDown: boolean,
    cityColor: PlayerColor | null,
    onLeftClick: (index: number, card: Card | null) => void,
    maxLength?: number,
  }
) {
  const rowLength = maxLength ?? maxCitySize(cards);

  return (
    <div style={cardRowStyle}>
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
        )
      })}
    </div>
  )
}

export default CardRow;