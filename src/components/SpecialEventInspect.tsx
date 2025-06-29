import { useGame } from "../engine/GameContext";
import { EffectType, ResourceType, SpecialEvent } from "../engine/gameTypes";
import {
  canVisitSpecialEvent,
  EFFECT_ORDER,
  getPlayerColor,
  getPlayerId,
  isNotYourTurn,
  mapOverEffectTypes,
  RESOURCE_ORDER,
} from "../engine/helpers";
import { EffectTypeIcon, ResourceIcon } from "./Icons"; // Assuming EffectTypeIcon is in your Icons file
import Inspectable from "./Inspectable";
import {
  arrowResourceStyling,
  renderButtons,
  renderWorkers,
} from "./LocationsDisplay"; // Assuming these are here

// Style for each labeled section
const sectionStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "4px",
};

// Style for the container holding the effect type icons
const iconContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: "12px",
  alignItems: "center",
  flexWrap: "wrap",
};

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
  // split but keep whitespace / punctuation
  const parts = text.split(/(\s+|[.,;!?]+)/);

  return parts.map((part, idx) => {
    // normalise token for matching (strip non-letters, lower-case)
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

    // plain text or delimiter
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

  // Filter for only the effect types that are actually required (count > 0)
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
          gap: "24px", // Increased gap for better section separation
          maxHeight: "100%",
          alignItems: "center",
        }}
      >
        <h2 style={{ margin: 0, textAlign: "center" }}>{specialEvent.name}</h2>

        {/* --- Requirements Section --- */}
        {(specialEvent.cardRequirement?.length > 0 ||
          requiredEffects.length > 0) && (
          <div style={sectionStyle}>
            {/* header */}
            <strong style={{ margin: 0, marginBottom: 4 }}>
              Requirements:
            </strong>

            {/* body */}
            {specialEvent.cardRequirement?.length > 0 && (
              <span>{specialEvent.cardRequirement.join(", ")}</span>
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

        {/* --- Special Description --- */}
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

        {/* --- Interaction Section --- */}
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
