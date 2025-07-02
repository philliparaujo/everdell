import {
  defaultResources,
  EFFECT_ORDER,
  RESOURCE_ORDER,
} from "../engine/gameDefaults";
import {
  Card,
  EffectType,
  Player,
  ResourceCount,
  ResourceType,
  SpecialEvent,
} from "../engine/gameTypes";

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

export function countCardOccurrences(city: Card[], cardName: string): number {
  return city.reduce((acc, curr) => acc + (curr.name === cardName ? 1 : 0), 0);
}

// True if any of the cards are on the list
export function hasCards(city: Card[], cardNames: string[]): boolean {
  return city.some((card) => cardNames.includes(card.name));
}

export function countEffectTypeOccurrences(
  city: Card[],
  effectType: EffectType,
): number {
  return city.reduce(
    (acc, curr) => acc + (curr.effectType === effectType ? 1 : 0),
    0,
  );
}

// True if any of the special events are on the list and have workers on them
export function isOnSpecialEvents(
  player: Player,
  specialEvents: SpecialEvent[],
  eventNames: string[],
): boolean {
  return specialEvents.some(
    (specialEvent) =>
      eventNames.includes(specialEvent.name) &&
      specialEvent.workers[player.color] > 0,
  );
}
