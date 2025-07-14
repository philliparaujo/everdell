import { useGame } from "../engine/GameContext";
import { EffectType, SpecialEvent } from "../engine/gameTypes";
import {
  canAchieveSpecialEvent,
  canVisitSpecialEvent,
  isNotYourTurn,
} from "../utils/gameLogic";
import { getPlayerColor, getPlayerId } from "../utils/identity";
import { listCardNames, mapOverEffectTypes } from "../utils/loops";
import {
  renderVisitButtons,
  renderTextWithIcons,
  renderVisitingWorkers,
} from "../utils/react";
import { EffectTypeIcon, ResourceIcon } from "./Icons";
import Inspectable from "./Inspectable";

function SpecialEventInspect({
  specialEvent,
  onClose,
  index,
}: {
  specialEvent: SpecialEvent;
  onClose: () => void;
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

  const requiredEffects = Object.entries(
    specialEvent.effectTypeRequirement,
  ).filter(([_, count]) => count > 0);

  return (
    <Inspectable onClose={onClose}>
      <div className="flex flex-1 flex-col overflow-y-auto min-w-96 gap-6 max-h-[100%] items-center">
        <h1 className="text-2xl font-bold">{specialEvent.name}</h1>

        {/* --- Requirements --- */}
        {(specialEvent.cardRequirement?.length > 0 ||
          requiredEffects.length > 0) && (
          <div className="flex flex-col gap-2">
            <strong className="m-0 mb-1">Requirements:</strong>

            {specialEvent.cardRequirement?.length > 0 && (
              <span>{listCardNames(specialEvent.cardRequirement)}</span>
            )}

            {requiredEffects.length > 0 && (
              <div className="flex flex-wrap items-center gap-3">
                {mapOverEffectTypes(
                  specialEvent.effectTypeRequirement,
                  (key, val) => (
                    <div key={key} className="flex items-center gap-1">
                      <EffectTypeIcon type={key as EffectType} /> {val}
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        )}

        {/* --- Effects and rewards --- */}
        {specialEvent.specialDescription && (
          <div className="flex flex-col gap-2">
            <strong>When achieved...</strong>
            <p className="m-0 flex items-center gap-1">
              {renderTextWithIcons(specialEvent.specialDescription)}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2">
          <strong>Reward:</strong>
          {specialEvent.specialReward && (
            <p className="m-0 flex items-center gap-1">
              {renderTextWithIcons(specialEvent.specialReward)}
            </p>
          )}
          {specialEvent.value && (
            <div className="flex items-center justify-center gap-1">
              <ResourceIcon type={"coins"} />
              {specialEvent.value}
            </div>
          )}
        </div>

        {/* --- Visiting --- */}
        <div className="flex flex-col items-center h-6">
          {renderVisitButtons(
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
          {renderVisitingWorkers(specialEvent)}
        </div>
      </div>
    </Inspectable>
  );
}

export default SpecialEventInspect;
