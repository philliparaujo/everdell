import { Card } from "../engine/gameTypes";

function CardPreview({ card }: { card: Card }) {
  return (
    <div style={{
      width: '100px', height: '170px', background: '#fff',
      border: '1px solid #ccc', padding: '4px', borderRadius: '4px',
      textAlign: 'center'
    }}>
      <img
        src={require(`../assets/images/${card.imageKey}.jpg`)}
        alt={card.name}
        style={{
          width: '100%', height: '150px',
          objectFit: 'cover', borderRadius: '4px'
        }}
      />
      <strong style={{ fontSize: '12px' }}>{card.name}</strong>
    </div>
  );
}

export default CardPreview;