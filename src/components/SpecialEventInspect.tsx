import { useGame } from "../engine/GameContext";
import { EFFECT_ORDER, RESOURCE_ORDER } from "../engine/gameDefaults";
import { EffectType, ResourceType, SpecialEvent } from "../engine/gameTypes";
import { canVisitSpecialEvent, isNotYourTurn } from "../utils/gameLogic";
import { getPlayerColor, getPlayerId } from "../utils/identity";
import { listCardNames, mapOverEffectTypes } from "../utils/loops";
import { EffectTypeIcon, ResourceIcon } from "./Icons";
import Inspectable from "./Inspectable";
import { renderButtons, renderWorkers } from "./LocationsDisplay";

// Handle singular and plural words
const RESOURCE_ALIASES: Record<string, ResourceType> = {
  twig: "twigs",
  pebble: "pebbles",
  berry: "berries",
  coin: "coins",
  card: "cards",
  wildcard: "wildcards",
};

const EFFECT_ALIASES: Record<string, EffectType> = {
  blues: "Blue",
  greens: "Green",
  purples: "Purple",
  reds: "Red",
  tans: "Tan",
};

export function renderTextWithIcons(text: string): React.ReactNode[] {
  const parts = text.split(/(\s+|[.,;!?]+)/);

  return parts.map((part, idx) => {
    const bare = part.toLowerCase().replace(/[^a-z]/g, "");

    if ((RESOURCE_ORDER as string[]).includes(bare)) {
      return <ResourceIcon key={idx} type={bare as ResourceType} />;
    }

    if (bare in RESOURCE_ALIASES) {
      return <ResourceIcon key={idx} type={RESOURCE_ALIASES[bare]} />;
    }

    if (EFFECT_ORDER.map((e) => e.toLowerCase()).includes(bare)) {
      const canonical = bare.charAt(0).toUpperCase() + bare.slice(1); // "blue" → "Blue"
      return <EffectTypeIcon key={idx} type={canonical as EffectType} />;
    }

    if (bare in EFFECT_ALIASES) {
      return <EffectTypeIcon key={idx} type={EFFECT_ALIASES[bare]} />;
    }

    // Plain text or delimeter
    return part;
  });
}

function SpecialEventInspect({
  specialEvent,
  onClose,
  index,
}: {
  specialEvent: SpecialEvent;
  onClose: () => void;
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
        <div className="flex flex-col items-center gap-2">
          {renderButtons(
            disabled || !canVisit,
            disabled || !canLeave,
            () => visitSpecialEvent(storedId, index, 1),
            () => visitSpecialEvent(storedId, index, -1),
          )}
          {renderWorkers(specialEvent)}
        </div>
      </div>
    </Inspectable>
  );
}

export default SpecialEventInspect;
