import { useGame } from "../engine/GameContext";
import { Event } from "../engine/gameTypes";
import { getPlayerId, isNotYourTurn } from "../engine/helpers";
import { EffectTypeIcon, ResourceIcon } from "./Icons";
import { arrowResourceStyling, BaseLocationDisplay, locationsDisplayStyling, renderButtons, renderWorkers } from "./LocationsDisplay";

function EventDisplay({ event, index }: { event: Event, index: number }) {
  const { game, visitEvent } = useGame();

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

  return (
    <BaseLocationDisplay
      buttonChildren={
        renderButtons(
          disabled,
          () => visitEvent(storedId, index, 1),
          () => visitEvent(storedId, index, -1)
        )
      }
      workerChildren={renderWorkers(event)}
      resourceChildren={(
        <div style={arrowResourceStyling}>
          <EffectTypeIcon type={event.effectTypeRequirement} /> {event.effectTypeCount}
          {"→"}
          <ResourceIcon type={"coins"} /> {event.value}
        </div>
      )}
    />
  )
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