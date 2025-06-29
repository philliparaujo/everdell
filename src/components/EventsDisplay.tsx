import { useGame } from "../engine/GameContext";
import { Event } from "../engine/gameTypes";
import {
  canVisitEvent,
  getPlayerColor,
  getPlayerId,
  isNotYourTurn,
} from "../engine/helpers";
import { EffectTypeIcon, ResourceIcon } from "./Icons";
import {
  arrowResourceStyling,
  BaseLocationDisplay,
  locationsDisplayStyling,
  renderButtons,
  renderWorkers,
} from "./LocationsDisplay";

function EventDisplay({ event, index }: { event: Event; index: number }) {
  const { game, visitEvent } = useGame();

  const storedId = getPlayerId();
  const playerColor = getPlayerColor(game, storedId);

  const disabled = isNotYourTurn(game, storedId);
  const canVisit =
    playerColor === null ? false : canVisitEvent(game, event, playerColor, 1);
  const canLeave =
    playerColor === null ? false : canVisitEvent(game, event, playerColor, -1);

  return (
    <BaseLocationDisplay
      titleChildren={event.name}
      buttonChildren={renderButtons(
        disabled || !canVisit,
        disabled || !canLeave,
        () => visitEvent(storedId, index, 1),
        () => visitEvent(storedId, index, -1),
      )}
      workerChildren={renderWorkers(event)}
      resourceChildren={
        <div style={{ ...arrowResourceStyling, height: "35px" }}>
          <EffectTypeIcon type={event.effectTypeRequirement} />{" "}
          {event.effectTypeCount}
          {"→"}
          <ResourceIcon type={"coins"} /> {event.value}
        </div>
      }
      used={event.used}
      wide={true}
    />
  );
}

function EventsDisplay() {
  const { game } = useGame();

  return (
    <div style={locationsDisplayStyling}>
      {game.events.map((event: Event, index: number) => (
        <EventDisplay event={event} index={index} />
      ))}
    </div>
  );
}

export default EventsDisplay;
