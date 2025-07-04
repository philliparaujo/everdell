import Button from "../components/Button";
import { EffectTypeIcon, ResourceIcon, WorkerIcon } from "../components/Icons";
import { EFFECT_ORDER, RESOURCE_ORDER } from "../engine/gameDefaults";
import { EffectType, ResourceType, Visitable } from "../engine/gameTypes";

export function renderVisitingWorkers(location: Visitable): React.ReactNode {
  return (
    <div className="flex h-6 content-center gap-2">
      {location.workers.Red > 0 && (
        <span className="flex items-center gap-1">
          <WorkerIcon playerColor={"Red"} /> {location.workers.Red}
        </span>
      )}
      {location.workers.Blue > 0 && (
        <span className="flex items-center gap-1">
          <WorkerIcon playerColor={"Blue"} /> {location.workers.Blue}
        </span>
      )}
    </div>
  );
}

export function renderVisitButtons(
  visitDisabled: boolean,
  leaveDisabled: boolean,
  onVisit: () => void,
  onLeave: () => void,
): React.ReactNode {
  return (
    <div>
      <Button disabled={visitDisabled} onClick={onVisit}>
        Visit
      </Button>
      <Button disabled={leaveDisabled} onClick={onLeave}>
        Leave
      </Button>
    </div>
  );
}

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
