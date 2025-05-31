import { Card, PlayerColor } from "../engine/gameTypes";
import { maxCitySize } from "../engine/helpers";
import CardPreview from "./CardPreview";

const rowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'nowrap',
  gap: '8px',
  padding: '4px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  height: '100%',
  overflowX: 'auto',
  overflowY: 'hidden',
};

function CardRow(
  {
    cards,
    placedDown,
    cityColor,
    onLeftClick,
    maxLength,
  }: {
    cards: Card[],
    placedDown: Boolean,
    cityColor: PlayerColor | null,
    onLeftClick: (index: number, card: Card | null) => void,
    maxLength?: number,
  }
) {
  const rowLength = maxLength ?? maxCitySize(cards);

  return (
    <div style={rowStyle}>
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