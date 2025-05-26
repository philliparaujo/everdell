import { Card } from "../engine/gameTypes";

function CardPreview({ card, onClick }: { card: Card | null, onClick?: () => void }) {
  const borderStyle = card?.discarding ? '2px solid red' : (card?.playing ? '2px solid green' : '2px solid #ccc');

  return (
    <div
      style={{
        width: '100px',
        height: '170px',
        background: '#fff',
        border: borderStyle,
        padding: '4px',
        borderRadius: '4px',
        textAlign: 'center',
        cursor: onClick ? 'pointer' : 'default',
        flex: '0 0 auto',
      }}
      onClick={onClick}
    >
      {card ? (
        <img
          src={require(`../assets/images/${card?.imageKey}.jpg`)}
          alt={card?.name ?? "Empty card"}
          style={{
            width: '100%', height: '150px',
            objectFit: 'cover', borderRadius: '4px'
          }}
        />
      ) : <></>}
      <strong style={{ fontSize: '12px' }}>{card?.name}</strong>
    </div>
  );
}

export default CardPreview;
