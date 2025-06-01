import { useGame } from "../engine/GameContext";
import { Card, defaultResources, PlayerColor, ResourceType } from "../engine/gameTypes";
import { getPlayerId, isNotYourTurn, mapOverResources } from "../engine/helpers";
import { ResourceIcon } from "./Icons";

function CardInspect(
  { card, index, cityColor, onClose, placedDown }: { card: Card, index: number, cityColor: PlayerColor | null, onClose: () => void, placedDown: Boolean }
) {
  const {
    game,
    visitCardInCity,
    addResourcesToCardInCity,
    toggleOccupiedCardInCity,
  } = useGame();

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

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
            border: '1px solid black',
          }}
        />

        <div
          style={{
            maxWidth: '100%'
          }}
        >
          <h2>{card.name}</h2>
          {card.value !== undefined && <p><strong>Base Points:</strong> {card.value}</p>}
          {placedDown && card.occupied !== null && cityColor ? (
            <p>
              <strong>Occupied:</strong>
              <button disabled={disabled} onClick={() => toggleOccupiedCardInCity(storedId, cityColor, index, !card.occupied)}>{card.occupied ? "Yes" : "No"}</button>
            </p>
          ) : <></>}

          {placedDown && card.maxDestinations != null && cityColor !== null && (
            <>
              <button disabled={disabled} onClick={() => visitCardInCity(storedId, cityColor, index, 1)}>{"Visit"}</button>
              <button disabled={disabled} onClick={() => visitCardInCity(storedId, cityColor, index, -1)}>{"Leave"}</button>
            </>
          )}

          {placedDown && card.storage && (
            <div>
              <strong>Stored Resources:</strong>
              <ul>
                {mapOverResources(card.storage, (key, val) => (
                  <li key={key}>
                    <ResourceIcon type={key as ResourceType} /> {val}
                    <button disabled={disabled} onClick={() => addResourcesToCardInCity(storedId, game.turn, index, { ...defaultResources, [key]: -1 })}>{"-"}</button>
                    <button disabled={disabled} onClick={() => addResourcesToCardInCity(storedId, game.turn, index, { ...defaultResources, [key]: 1 })}>{"+"}</button>
                  </li>
                ), false)}
              </ul>
            </div>
          )}

          {placedDown && card.maxDestinations != null && card.workers && (
            <div>
              <strong>Workers on card:</strong>
              <ul>
                {Object.entries(card.workers).map(([color, count]) =>
                  count > 0 ? <li key={color}>{color}: {count}</li> : null
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div >
  );
}

export default CardInspect;
