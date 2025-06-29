import { useGame } from "../engine/GameContext";
import { SpecialEvent } from "../engine/gameTypes";
import {
  canVisitSpecialEvent,
  getPlayerColor,
  getPlayerId,
  isNotYourTurn,
} from "../engine/helpers";
import { cardNamePreviewStyling } from "./CardPreview";
import {
  BaseLocationDisplay,
  locationsDisplayStyling,
  renderButtons,
  renderWorkers,
} from "./LocationsDisplay";

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
          style={{ display: "flex", flexDirection: "column", height: "35px" }}
        >
          {specialEvent.cardRequirement.map((cardName) => (
            <strong style={cardNamePreviewStyling}>{cardName}</strong>
          ))}
        </div>
      }
      used={specialEvent.used}
      wide={true}
    />
  );
}

function SpecialEventsDisplay() {
  const { game } = useGame();

  return (
    <div style={locationsDisplayStyling}>
      {game.specialEvents.map(
        (specialEvent: SpecialEvent, index: number) =>
          index < 4 && (
            <SpecialEventDisplay specialEvent={specialEvent} index={index} />
          ),
      )}
    </div>
  );
}

export default SpecialEventsDisplay;
