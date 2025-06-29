import { useGame } from "../engine/GameContext";
import { EffectType, SpecialEvent } from "../engine/gameTypes";
import {
  canVisitSpecialEvent,
  getPlayerColor,
  getPlayerId,
  isNotYourTurn,
  mapOverEffectTypes,
} from "../engine/helpers";
import { cardNamePreviewStyling } from "./CardPreview";
import Hoverable from "./Hoverable";
import { EffectTypeIcon } from "./Icons";
import {
  BaseLocationDisplay,
  locationsDisplayStyling,
  renderButtons,
  renderWorkers,
  resourceStyling,
} from "./LocationsDisplay";
import SpecialEventInspect from "./SpecialEventInspect";

function SpecialEventDisplay({
  specialEvent,
  index,
}: {
  specialEvent: SpecialEvent;
  index: number;
}) {
  const { game, visitSpecialEvent } = useGame();

  const storedId = getPlayerId();
  const playerColor = getPlayerColor(game, storedId);

  const disabled = isNotYourTurn(game, storedId);
  const canVisit =
    playerColor === null
      ? false
      : canVisitSpecialEvent(game, specialEvent, playerColor, 1);
  const canLeave =
    playerColor === null
      ? false
      : canVisitSpecialEvent(game, specialEvent, playerColor, -1);

  return (
    <Hoverable
      isInteractive={true}
      onRightClick={(closeInspector) => (
        <SpecialEventInspect
          specialEvent={specialEvent}
          onClose={closeInspector}
          index={index}
        />
      )}
    >
      <BaseLocationDisplay
        titleChildren={specialEvent.name}
        buttonChildren={renderButtons(
          disabled || !canVisit,
          disabled || !canLeave,
          () => visitSpecialEvent(storedId, index, 1),
          () => visitSpecialEvent(storedId, index, -1),
        )}
        workerChildren={renderWorkers(specialEvent)}
        resourceChildren={
          <div
            style={{ display: "flex", flexDirection: "column", height: "40px" }}
          >
            {specialEvent.cardRequirement.map((cardName) => (
              <strong style={cardNamePreviewStyling}>{cardName}</strong>
            ))}
            <div style={{ ...resourceStyling, fontSize: "9px" }}>
              {mapOverEffectTypes(
                specialEvent.effectTypeRequirement,
                (key, val) => (
                  <div key={key}>
                    <EffectTypeIcon type={key as EffectType} /> {val}
                  </div>
                ),
              )}
            </div>
          </div>
        }
        used={specialEvent.used}
        wide={true}
      />
    </Hoverable>
  );
}

function SpecialEventsDisplay() {
  const { game } = useGame();

  return (
    <div style={locationsDisplayStyling}>
      {game.specialEvents.map((specialEvent: SpecialEvent, index: number) => (
        <SpecialEventDisplay specialEvent={specialEvent} index={index} />
      ))}
    </div>
  );
}

export default SpecialEventsDisplay;
