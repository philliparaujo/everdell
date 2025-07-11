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

export function countCardValue(city: Card[]): number {
  return city.reduce(
    (acc, curr) => acc + (curr.below === "Dungeon" ? 0 : curr.value),
    0,
  );
}

export function countCardOccurrences(city: Card[], cardName: string): number {
  return city.reduce(
    (acc, curr) =>
      acc + (curr.name === cardName && curr.below !== "Dungeon" ? 1 : 0),
    0,
  );
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
    (acc, curr) =>
      acc +
      (curr.effectType === effectType && curr.below !== "Dungeon" ? 1 : 0),
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

export function sortCity(city: Card[]): Card[] {
  return city
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .sort((a, b) =>
      a.effectType.toString() < b.effectType.toString() ? -1 : 1,
    );
}

export function sortGroupedCards(
  groupedCards: { card: Card; index: number }[][],
): { card: Card; index: number }[][] {
  // The .sort() method sorts the array in place.
  return groupedCards.sort((stackA, stackB) => {
    // Get the top card from each stack.
    // Based on your groupCardsByBelow function, the top card is the first one.
    const topCardA = stackA[0].card;
    const topCardB = stackB[0].card;

    // 1. Primary Sort: by effectType (e.g., Green, Purple, Red)
    const effectTypeComparison = topCardA.effectType
      .toString()
      .localeCompare(topCardB.effectType.toString());

    // If the effect types are different, we're done sorting these two.
    if (effectTypeComparison !== 0) {
      return effectTypeComparison;
    }

    // 2. Secondary Sort: by card name (alphabetical)
    // This only runs if the effect types are the same.
    return topCardA.name.localeCompare(topCardB.name);
  });
}
