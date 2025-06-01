import { COLORS } from "../colors";
import { useGame } from "../engine/GameContext";
import { Card, defaultResources, PlayerColor, ResourceType } from "../engine/gameTypes";
import { getPlayerId, isNotYourTurn, mapOverResources } from "../engine/helpers";
import Button from "./Button";
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
        backgroundColor: COLORS.cardInspectBackground,
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
          backgroundColor: COLORS.cardInspect,
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
            border: `1px solid ${COLORS.cardInspectImageBorder}`,
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
              <Button disabled={disabled} onClick={() => toggleOccupiedCardInCity(storedId, cityColor, index, !card.occupied)}>{card.occupied ? "Yes" : "No"}</Button>
            </p>
          ) : <></>}

          {placedDown && card.maxDestinations != null && cityColor !== null && (
            <>
              <Button disabled={disabled} onClick={() => visitCardInCity(storedId, cityColor, index, 1)}>{"Visit"}</Button>
              <Button disabled={disabled} onClick={() => visitCardInCity(storedId, cityColor, index, -1)}>{"Leave"}</Button>
            </>
          )}

          {placedDown && card.storage && (
            <div>
              <strong>Stored Resources:</strong>
              <ul>
                {mapOverResources(card.storage, (key, val) => (
                  <li key={key}>
                    <ResourceIcon type={key as ResourceType} /> {val}
                    <Button disabled={disabled} onClick={() => addResourcesToCardInCity(storedId, game.turn, index, { ...defaultResources, [key]: -1 })}>{"-"}</Button>
                    <Button disabled={disabled} onClick={() => addResourcesToCardInCity(storedId, game.turn, index, { ...defaultResources, [key]: 1 })}>{"+"}</Button>
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
