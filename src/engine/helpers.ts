import { COLORS } from "../colors";
import { MAX_MEADOW_SIZE } from "./gameConstants";
import {
  Card,
  defaultResources,
  EffectType,
  Event,
  GameState,
  Journey,
  Location,
  Player,
  PlayerColor,
  Resources,
  ResourceType,
  Season,
  SpecialEvent,
} from "./gameTypes";

export const shuffleArray = (array: any[]) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export function partition<T>(
  arr: T[],
  predicate: (item: T) => boolean,
): [T[], T[]] {
  const keep: T[] = [];
  const discard: T[] = [];
  for (const item of arr) {
    (predicate(item) ? keep : discard).push(item);
  }
  return [keep, discard];
}

export function storePlayerName(name: string) {
  console.log("Storing", name);
  sessionStorage.setItem("playerName", name);
}

export function storePlayerId(id: string) {
  console.log("Storing", id);
  sessionStorage.setItem("playerId", id);
}

export function getPlayerName(): string | null {
  return sessionStorage.getItem("playerName");
}

export function getPlayerId(): string | null {
  return sessionStorage.getItem("playerId");
}

export function seasonColor(season: Season) {
  switch (season) {
    case "Winter":
      return COLORS.seasonWinter;
    case "Spring":
      return COLORS.seasonSpring;
    case "Summer":
      return COLORS.seasonSummer;
    case "Autumn":
      return COLORS.seasonFall;
  }
}

export function getPlayerColor(
  game: GameState,
  playerId: string | null,
): PlayerColor | null {
  if (playerId === null) return null;
  if (playerId === game.players.Red.id) return "Red";
  if (playerId === game.players.Blue.id) return "Blue";
  return null;
}

export function oppositePlayerOf(playerColor: PlayerColor): PlayerColor {
  return playerColor === "Red" ? "Blue" : "Red";
}

export function isNotYourTurn(
  game: GameState,
  playerId: string | null,
): boolean {
  return getPlayerColor(game, playerId) !== game.turn;
}

const RESOURCE_ORDER: ResourceType[] = [
  "twigs",
  "resin",
  "pebbles",
  "berries",
  "coins",
  "cards",
  "wildcard",
];
export function mapOverResources(
  resources: Resources,
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

export function computeResourceDelta(
  oldResources: Resources,
  newResources: Resources,
): Resources {
  const delta = { ...defaultResources };

  for (const type of RESOURCE_ORDER) {
    delta[type] = newResources[type] - oldResources[type];
  }
  return delta;
}

export function computeCardsDelta(
  oldCards: Card[],
  newCards: Card[],
): { added: string[]; removed: string[] } {
  const oldCardCounts = new Map<string, number>();
  oldCards.forEach((card) => {
    oldCardCounts.set(card.name, (oldCardCounts.get(card.name) || 0) + 1);
  });

  const newCardCounts = new Map<string, number>();
  newCards.forEach((card) => {
    newCardCounts.set(card.name, (newCardCounts.get(card.name) || 0) + 1);
  });

  const added: string[] = [];
  const removed: string[] = [];

  newCardCounts.forEach((newCount, cardName) => {
    const oldCount = oldCardCounts.get(cardName) || 0;
    if (newCount > oldCount) {
      for (let i = 0; i < newCount - oldCount; i++) {
        added.push(cardName);
      }
    }
  });

  oldCardCounts.forEach((oldCount, cardName) => {
    const newCount = newCardCounts.get(cardName) || 0;
    if (oldCount > newCount) {
      for (let i = 0; i < oldCount - newCount; i++) {
        removed.push(cardName);
      }
    }
  });

  return { added, removed };
}

export function isSafeToEndTurn(state: GameState): boolean {
  const currentPlayer = state.players[state.turn];

  const meadowFull =
    state.meadow.length === MAX_MEADOW_SIZE || state.deck.length === 0;
  const notPerformingAction =
    !currentPlayer.discarding &&
    !currentPlayer.giving &&
    !currentPlayer.playing;

  return meadowFull && notPerformingAction;
}

export function maxCitySize(city: Card[]) {
  const baseMaxCitySize = 15;
  const husbandWifePairs = Math.min(
    countCardInCity(city, "Husband"),
    countCardInCity(city, "Wife"),
  );
  const wanderers = countCardInCity(city, "Wanderer");

  return baseMaxCitySize + husbandWifePairs + wanderers;
}

export function canVisitLocation(
  state: GameState,
  location: Location,
  playerColor: PlayerColor,
  workersVisiting: 1 | -1,
): boolean {
  const player = state.players[playerColor];
  const newWorkersLeft = player.workers.workersLeft - workersVisiting;

  // Cannot end with negative workers or more than max available
  if (newWorkersLeft < 0 || newWorkersLeft > player.workers.maxWorkers)
    return false;
  // Cannot leave location that doesn't have your worker on it
  if (workersVisiting < 0 && location.workers[playerColor] <= 0) return false;

  const workersOnLocation = location.workers.Red + location.workers.Blue;

  // Cannot visit exclusive location with a worker already on it
  if (workersVisiting >= 0 && location.exclusive && workersOnLocation > 0)
    return false;

  return true;
}

export function canVisitJourney(
  state: GameState,
  journey: Journey,
  playerColor: PlayerColor,
  workersVisiting: 1 | -1,
): boolean {
  const player = state.players[playerColor];
  const newWorkersLeft = player.workers.workersLeft - workersVisiting;

  // Cannot end with negative workers or more than max available
  if (newWorkersLeft < 0 || newWorkersLeft > player.workers.maxWorkers)
    return false;
  // Canont leave journey that doesn't have your worker on it
  if (workersVisiting < 0 && journey.workers[playerColor] <= 0) return false;

  const workersOnJourney = journey.workers.Red + journey.workers.Blue;

  // Cannot visit exclusive journey with a worker already on it
  if (workersVisiting >= 0 && journey.exclusive && workersOnJourney > 0)
    return false;
  // Cannot visit journey if player not in Autumn
  if (player.season !== "Autumn") return false;

  return true;
}

export function canVisitEvent(
  state: GameState,
  event: Event,
  playerColor: PlayerColor,
  workersVisiting: 1 | -1,
): boolean {
  const player = state.players[playerColor];
  const newWorkersLeft = player.workers.workersLeft - workersVisiting;

  // Cannot end with negative workers or more than max available
  if (newWorkersLeft < 0 || newWorkersLeft > player.workers.maxWorkers)
    return false;
  // Cannot leave event that doesn't have your worker on it
  if (workersVisiting < 0 && event.workers[playerColor] <= 0) return false;

  const requirementCount = player.city.reduce(
    (acc, curr) =>
      acc + (curr.effectType === event.effectTypeRequirement ? 1 : 0),
    0,
  );

  // Cannot visit event that is already used
  if (event.used && workersVisiting > 0) return false;
  // Cannot visit event if requirement not met
  if (requirementCount < event.effectTypeCount) return false;

  return true;
}

export function canVisitSpecialEvent(
  state: GameState,
  specialEvent: SpecialEvent,
  playerColor: PlayerColor,
  workersVisiting: 1 | -1,
): boolean {
  const player = state.players[playerColor];
  const newWorkersLeft = player.workers.workersLeft - workersVisiting;

  // Cannot end with negative workers or more than max available
  if (newWorkersLeft < 0 || newWorkersLeft > player.workers.maxWorkers)
    return false;
  // Cannot leave event that doesn't have your worker on it
  if (workersVisiting < 0 && specialEvent.workers[playerColor] <= 0)
    return false;

  // Assumes cardRequirement list has no duplicate card names
  const cardRequirementMet = specialEvent.cardRequirement
    .map((cardName) => hasCardInCity(player.city, cardName))
    .reduce((acc, curr) => acc && curr, true);

  const effectTypeRequirementMet = Object.entries(
    specialEvent.effectTypeRequirement,
  ).every(
    ([effectType, required]) =>
      countEffectTypeInCity(player.city, effectType as EffectType) >= required,
  );

  // Cannot visit special event that is already used
  if (specialEvent.used && workersVisiting > 0) return false;
  // Cannot visit special event if requirement not met
  if (!cardRequirementMet || !effectTypeRequirementMet) return false;

  return true;
}

export function canVisitCardInCity(
  state: GameState,
  card: Card,
  playerColor: PlayerColor,
  workersVisiting: 1 | -1,
): boolean {
  const player = state.players[playerColor];
  const newWorkersLeft = player.workers.workersLeft - workersVisiting;

  // Cannot end with negative workers or more than max available
  if (newWorkersLeft < 0 || newWorkersLeft > player.workers.maxWorkers)
    return false;
  // Cannot leave card that doesn't have your worker on it
  if (workersVisiting < 0 && card.workers[playerColor] <= 0) return false;

  // Cannot interact with card that doesn't have destinations
  if (card.maxDestinations === null || card.activeDestinations == null)
    return false;
  // Cannot end with negative workers on card or more than max destinations
  const newWorkersOnCard = card.activeDestinations + workersVisiting;
  if (newWorkersOnCard < 0 || newWorkersOnCard > card.maxDestinations)
    return false;

  return true;
}

export function countCardInCity(city: Card[], cardName: string): number {
  return city.reduce((acc, curr) => acc + (curr.name === cardName ? 1 : 0), 0);
}

export function hasCardInCity(city: Card[], cardName: string): boolean {
  return city.some((card) => card.name === cardName);
}

export function countEffectTypeInCity(
  city: Card[],
  effectType: EffectType,
): number {
  return city.reduce(
    (acc, curr) => acc + (curr.effectType === effectType ? 1 : 0),
    0,
  );
}

export function canGiveToSelf(player: Player): boolean {
  return hasCardInCity(player.city, "Undertaker");
}

export function canGiveToOpponent(
  player: Player,
  oppositePlayer: Player,
): boolean {
  return (
    hasCardInCity(player.city, "Post Office") ||
    hasCardInCity(player.city, "Teacher") ||
    hasCardInCity(oppositePlayer.city, "Post Office") ||
    (hasCardInCity(player.city, "Miner Mole") &&
      hasCardInCity(oppositePlayer.city, "Teacher"))
  );
}

export function canRevealDeck(player: Player, oppositePlayer: Player): boolean {
  return (
    hasCardInCity(player.city, "Cemetery") ||
    hasCardInCity(player.city, "Postal Pigeon") ||
    (hasCardInCity(player.city, "Miner Mole") &&
      hasCardInCity(oppositePlayer.city, "Postal Pigeon"))
  );
}

export function canRevealDiscard(player: Player): boolean {
  return hasCardInCity(player.city, "Cemetery");
}
