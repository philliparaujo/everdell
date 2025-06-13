import { COLORS } from "../colors";
import { useGame } from "../engine/GameContext";
import { Card, defaultResources, PlayerColor, ResourceType } from "../engine/gameTypes";
import { canVisitCardInCity, canVisitEvent, getPlayerColor, getPlayerId, isNotYourTurn, mapOverResources } from "../engine/helpers";
import { resourceBankStyling } from "../screens/Game";
import Button from "./Button";
import { ResourceIcon } from "./Icons";
import { renderButtons, renderWorkers } from "./LocationsDisplay";
import { resourceDisplayStyling } from "./ResourceBank";

function CardInspect(
  { card, index, cityColor, onClose, placedDown }: { card: Card, index: number, cityColor: PlayerColor | null, onClose: () => void, placedDown: boolean }
) {
  const {
    game,
    visitCardInCity,
    addResourcesToCardInCity,
    toggleOccupiedCardInCity,
  } = useGame();

  const storedId = getPlayerId();
  const playerColor = getPlayerColor(game, storedId);

  const disabled = isNotYourTurn(game, storedId);
  const canVisit = playerColor === null ? false : canVisitCardInCity(game, card, playerColor, 1);
  const canLeave = playerColor === null ? false : canVisitCardInCity(game, card, playerColor, -1);

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
          overflow: 'hidden',
        }}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <img
          src={require(`../assets/images/${card.imageKey}.jpg`)}
          alt={card.name}
          style={{
            maxHeight: '100%',
            maxWidth: '50%',
            width: 'auto',
            height: 'auto',
            objectFit: 'contain',
            borderRadius: '8px',
          }}
        />

        <div
          style={{
            flex: 1,
            overflowY: 'auto',
            minWidth: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <h1 style={{ fontSize: '32px', marginBottom: 0 }}>{card.name}</h1>
          {card.value !== undefined && <p><strong>Base Points:</strong> {card.value}</p>}
          {placedDown && card.occupied !== null && cityColor ? (
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              <strong style={{ color: card?.occupied ? COLORS.cardPreviewOccupied : COLORS.text }}>Occupied:</strong>
              <Button disabled={disabled} onClick={() => toggleOccupiedCardInCity(storedId, cityColor, index, !card.occupied)}>{card.occupied ? "Yes" : "No"}</Button>
            </div>
          ) : <></>}

          {placedDown && card.storage && (
            <div style={resourceBankStyling}>
              {mapOverResources(card.storage, (key, val) => {
                return (key === "cards" ? (<></>) :
                  (
                    <div key={key} style={{
                      ...resourceDisplayStyling,
                      width: 'auto',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: '8px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0px' }}>
                        <ResourceIcon type={key as ResourceType} />
                        <span>{val}</span>
                      </div>
                      <div style={{ display: 'flex', }}>
                        <Button disabled={disabled} onClick={() => addResourcesToCardInCity(storedId, game.turn, index, { ...defaultResources, [key]: -1 })}>-</Button>
                        <Button disabled={disabled} onClick={() => addResourcesToCardInCity(storedId, game.turn, index, { ...defaultResources, [key]: 1 })}>+</Button>
                      </div>
                    </div>
                  )
                )
              }, false)}
            </div>
          )}

          {placedDown && card.maxDestinations != null && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              {cityColor !== null &&
                renderButtons(
                  disabled || !canVisit,
                  disabled || !canLeave,
                  () => visitCardInCity(storedId, cityColor, index, 1),
                  () => visitCardInCity(storedId, cityColor, index, -1)
                )
              }
              {card.workers && renderWorkers(card)}
            </div>
          )}
        </div>
      </div>
    </div >
  );
}

export default CardInspect;
