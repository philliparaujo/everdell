import {
  defaultResources,
  EFFECT_ORDER,
  RESOURCE_ORDER,
} from "../engine/gameDefaults";
import { EffectType, ResourceCount, ResourceType } from "../engine/gameTypes";

export function listCardNames(cardNames: string[]): string {
  return cardNames.join(", ");
}

export function mapOverResources(
  resources: ResourceCount,
  onMap: (key: ResourceType, val: number) => React.ReactNode,
  filter: boolean = true,
  onNoResources?: () => React.ReactNode,
) {
  const resourceCount = RESOURCE_ORDER.reduce(
    (acc, curr) => acc + Math.abs(resources[curr]),
    0,
  );
  if (resourceCount === 0 && onNoResources) {
    return onNoResources();
  }

  return RESOURCE_ORDER.filter((key) => resources[key] !== 0 || !filter).map(
    (key) => onMap(key, resources[key]),
  );
}

export function mapOverEffectTypes(
  effectTypes: Record<EffectType, number>,
  onMap: (key: EffectType, val: number) => React.ReactNode,
  filter: boolean = true,
  onNoEffectTypes?: () => React.ReactNode,
) {
  const effectTypeCount = EFFECT_ORDER.reduce(
    (acc, curr) => acc + Math.abs(effectTypes[curr]),
    0,
  );
  if (effectTypeCount === 0 && onNoEffectTypes) {
    return onNoEffectTypes();
  }

  return EFFECT_ORDER.filter((key) => effectTypes[key] !== 0 || !filter).map(
    (key) => onMap(key, effectTypes[key]),
  );
}

export function computeResourceDelta(
  oldResources: ResourceCount,
  newResources: ResourceCount,
): ResourceCount {
  const delta = { ...defaultResources };

  for (const type of RESOURCE_ORDER) {
    delta[type] = newResources[type] - oldResources[type];
  }
  return delta;
}
