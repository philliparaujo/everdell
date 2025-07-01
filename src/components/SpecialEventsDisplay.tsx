import { useGame } from "../engine/GameContext";
import { EffectType, SpecialEvent } from "../engine/gameTypes";
import { canVisitSpecialEvent, isNotYourTurn } from "../utils/gameLogic";
import { getPlayerColor, getPlayerId } from "../utils/identity";
import { mapOverEffectTypes } from "../utils/loops";
import Hoverable from "./Hoverable";
import { EffectTypeIcon } from "./Icons";
import {
  BaseLocationDisplay,
  renderButtons,
  renderWorkers,
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
          <div>
            {specialEvent.cardRequirement.map((cardName) => (
              <p className="font-bold text-xs">{cardName}</p>
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
    <div className="flex gap-2 h-[102px] pr-1">
      {game.specialEvents.map((specialEvent: SpecialEvent, index: number) => (
        <SpecialEventDisplay specialEvent={specialEvent} index={index} />
      ))}
    </div>
  );
}

export default SpecialEventsDisplay;
