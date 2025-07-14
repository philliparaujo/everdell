import { useGame } from "../engine/GameContext";
import { EffectType, SpecialEvent } from "../engine/gameTypes";
import {
  canAchieveSpecialEvent,
  canVisitSpecialEvent,
  isNotYourTurn,
} from "../utils/gameLogic";
import { getPlayerColor, getPlayerId } from "../utils/identity";
import { mapOverEffectTypes } from "../utils/loops";
import { renderVisitButtons, renderVisitingWorkers } from "../utils/react";
import Hoverable from "./Hoverable";
import { EffectTypeIcon } from "./Icons";
import { BaseLocationDisplay } from "./LocationsDisplay";
import SpecialEventInspect from "./SpecialEventInspect";

function SpecialEventDisplay({
  specialEvent,
  index,
}: {
  specialEvent: SpecialEvent;
  index: number;
}) {
  const { game, visitSpecialEvent, achieveSpecialEvent } = useGame();

  const storedId = getPlayerId();
  const playerColor = getPlayerColor(game, storedId);

  const disabled = isNotYourTurn(game, storedId);
  const canVisit =
    playerColor && canVisitSpecialEvent(game, specialEvent, playerColor, 1);
  const canLeave =
    playerColor && canVisitSpecialEvent(game, specialEvent, playerColor, -1);
  const canAchieve =
    playerColor && canAchieveSpecialEvent(game, specialEvent, playerColor);

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
        buttonChildren={renderVisitButtons(
          disabled || !canVisit,
          disabled || !canLeave,
          () => visitSpecialEvent(storedId, index, 1),
          () => visitSpecialEvent(storedId, index, -1),
          game.activeExpansions.includes("legends")
            ? disabled || !canAchieve
            : undefined,
          game.activeExpansions.includes("legends")
            ? () => achieveSpecialEvent(storedId, index)
            : undefined,
        )}
        workerChildren={renderVisitingWorkers(specialEvent)}
        resourceChildren={
          <div>
            {specialEvent.cardRequirement.map((cardName) => (
              <p className="font-bold text-[11px]">{cardName}</p>
            ))}
            <div className="flex flex-wrap justify-center gap-2 text-[10px]">
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
    <div className="flex gap-2 pr-1">
      {game.specialEvents.map((specialEvent: SpecialEvent, index: number) => (
        <SpecialEventDisplay specialEvent={specialEvent} index={index} />
      ))}
    </div>
  );
}

export default SpecialEventsDisplay;
