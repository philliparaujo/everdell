import { useGame } from "../engine/GameContext";
import { EffectType, ResourceType, SpecialEvent } from "../engine/gameTypes";
import {
  canVisitSpecialEvent,
  EFFECT_ORDER,
  getPlayerColor,
  getPlayerId,
  isNotYourTurn,
  listCardNames,
  mapOverEffectTypes,
  RESOURCE_ORDER,
} from "../engine/helpers";
import { EffectTypeIcon, ResourceIcon } from "./Icons";
import Inspectable from "./Inspectable";
import {
  arrowResourceStyling,
  renderButtons,
  renderWorkers,
} from "./LocationsDisplay";

const sectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

const iconContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

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
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          minWidth: "400px",
          display: "flex",
          flexDirection: "column",
          gap: "24px",
          maxHeight: "100%",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0, textAlign: "center" }}>{specialEvent.name}</h2>

        {/* --- Requirements --- */}
        {(specialEvent.cardRequirement?.length > 0 ||
          requiredEffects.length > 0) && (
          <div style={sectionStyle}>
            <strong style={{ margin: 0, marginBottom: 4 }}>
              Requirements:
            </strong>

            {specialEvent.cardRequirement?.length > 0 && (
              <span>{listCardNames(specialEvent.cardRequirement)}</span>
            )}

            {requiredEffects.length > 0 && (
              <div style={iconContainerStyle}>
                {mapOverEffectTypes(
                  specialEvent.effectTypeRequirement,
                  (key, val) => (
                    <div key={key}>
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
          <div style={sectionStyle}>
            <strong>When achieved...</strong>
            <p style={{ margin: 0 }}>
              {renderTextWithIcons(specialEvent.specialDescription)}
            </p>
          </div>
        )}

        <div style={sectionStyle}>
          <strong>Reward:</strong>
          {specialEvent.specialReward && (
            <p style={{ margin: 0 }}>
              {renderTextWithIcons(specialEvent.specialReward)}
            </p>
          )}
          {specialEvent.value && (
            <span style={arrowResourceStyling}>
              <ResourceIcon type={"coins"} />
              {specialEvent.value}
            </span>
          )}
        </div>

        {/* --- Visiting --- */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "8px",
          }}
        >
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
