import { Card } from "../engine/gameTypes";

function CardInspect({ card, onClose }: { card: Card, onClose: () => void }) {
  return (
    <div
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          display: 'flex',
          gap: '32px',
          backgroundColor: '#fff',
          padding: '24px',
          borderRadius: '12px',
          maxWidth: '80%',
          maxHeight: '80%',
        }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <img
          src={require(`../assets/images/${card.imageKey}.jpg`)}
          alt={card.name}
          style={{
            height: '500px',
            width: 'auto',
            flexShrink: 0,
            borderRadius: '8px',
            border: '2px solid black',
          }}
        />

        <div
          style={{
            maxWidth: '100%'
          }}
        >
          <h2>{card.name}</h2>
          <p><strong>Occupied:</strong> {card.occupied ? "Yes" : "No"}</p>

          {card.storage && (
            <div>
              <strong>Stored Resources:</strong>
              <ul>
                {Object.entries(card.storage).map(([key, val]) =>
                  val > 0 ? <li key={key}>{key}: {val}</li> : null
                )}
              </ul>
            </div>
          )}

          {card.workers && (
            <div>
              <strong>Workers on card:</strong>
              <ul>
                {Object.entries(card.workers).map(([color, count]) =>
                  count > 0 ? <li key={color}>{color}: {count}</li> : null
                )}
              </ul>
            </div>
          )}

          {card.value !== undefined && <p><strong>Base Points:</strong> {card.value}</p>}
        </div>
      </div>
    </div>
  );
}

export default CardInspect;
