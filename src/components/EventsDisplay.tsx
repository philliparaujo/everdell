import { useGame } from "../engine/GameContext";
import { Event } from "../engine/gameTypes";
import {
  canAchieveEvent,
  canVisitEvent,
  isNotYourTurn,
} from "../utils/gameLogic";
import { getPlayerColor, getPlayerId } from "../utils/identity";
import { renderVisitButtons, renderVisitingWorkers } from "../utils/react";
import { EffectTypeIcon, ResourceIcon } from "./Icons";
import { BaseLocationDisplay } from "./LocationsDisplay";

function EventDisplay({ event, index }: { event: Event; index: number }) {
  const { game, visitEvent, achieveEvent } = useGame();

  const storedId = getPlayerId();
  const playerColor = getPlayerColor(game, storedId);

  const disabled = isNotYourTurn(game, storedId);
  const canVisit = playerColor && canVisitEvent(game, event, playerColor, 1);
  const canLeave = playerColor && canVisitEvent(game, event, playerColor, -1);
  const canAchieve = playerColor && canAchieveEvent(game, event, playerColor);

  return (
    <BaseLocationDisplay
      titleChildren={event.name}
      buttonChildren={renderVisitButtons(
        disabled || !canVisit,
        disabled || !canLeave,
        () => visitEvent(storedId, index, 1),
        () => visitEvent(storedId, index, -1),
        game.activeExpansions.includes("legends")
          ? disabled || !canAchieve
          : undefined,
        game.activeExpansions.includes("legends")
          ? () => achieveEvent(storedId, index)
          : undefined,
      )}
      workerChildren={renderVisitingWorkers(event)}
      resourceChildren={
        <>
          <EffectTypeIcon type={event.effectTypeRequirement} />{" "}
          {event.effectTypeCount}
          {"→"}
          <ResourceIcon type={"coins"} /> {event.value}
        </>
      }
      used={event.used}
      wide={true}
    />
  );
}

function EventsDisplay() {
  const { game } = useGame();

  return (
    <div className="flex gap-2 h-[102px]">
      {game.events.map((event: Event, index: number) => (
        <EventDisplay event={event} index={index} />
      ))}
    </div>
  );
}

export default EventsDisplay;
