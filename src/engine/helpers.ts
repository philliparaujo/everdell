import { MAX_MEADOW_SIZE } from "./gameConstants";
import {
  Card,
  Event,
  GameState,
  Journey,
  Location,
  Player,
  PlayerColor,
  Resources,
  ResourceType,
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
  predicate: (item: T) => boolean
): [T[], T[]] {
  const keep: T[] = [];
  const discard: T[] = [];
  for (const item of arr) {
    (predicate(item) ? keep : discard).push(item);
  }
  return [keep, discard];
}

export function storePlayerName(name: string) {
  sessionStorage.setItem("playerName", name);
}

export function storePlayerId(id: string) {
  sessionStorage.setItem("playerId", id);
}

export function getPlayerName(): string | null {
  return sessionStorage.getItem("playerName");
}

export function getPlayerId(): string | null {
  return sessionStorage.getItem("playerId");
}

export function getPlayerColor(
  game: GameState,
  playerId: string | null
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
  playerId: string | null
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
  onNoResources?: () => React.ReactNode
) {
  const resourceCount = RESOURCE_ORDER.reduce(
    (acc, curr) => acc + resources[curr],
    0
  );
  if (resourceCount === 0 && onNoResources) {
    return onNoResources();
  }

  return RESOURCE_ORDER.filter((key) => resources[key] > 0 || !filter).map(
    (key) => onMap(key, resources[key])
  );
}

export function isSafeToEndTurn(state: GameState): boolean {
  return state.meadow.length === MAX_MEADOW_SIZE || state.deck.length === 0;
}

export function maxCitySize(city: Card[]) {
  const baseMaxCitySize = 15;
  const husbandWifePairs = Math.min(
    city.reduce((acc, curr) => acc + (curr.name === "Husband" ? 1 : 0), 0),
    city.reduce((acc, curr) => acc + (curr.name === "Wife" ? 1 : 0), 0)
  );
  const wanderers = city.reduce(
    (acc, curr) => acc + (curr.name === "Wanderer" ? 1 : 0),
    0
  );

  return baseMaxCitySize + husbandWifePairs + wanderers;
}

export function canVisitLocation(
  state: GameState,
  location: Location,
  playerColor: PlayerColor,
  workersVisiting: 1 | -1
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
  workersVisiting: 1 | -1
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
  workersVisiting: 1 | -1
): boolean {
  const player = state.players[playerColor];
  const newWorkersLeft = player.workers.workersLeft - workersVisiting;

  // Cannot end with negative workers or more than max available
  if (newWorkersLeft < 0 || newWorkersLeft > player.workers.maxWorkers)
    return false;
  // Canont leave event that doesn't have your worker on it
  if (workersVisiting < 0 && event.workers[playerColor] <= 0) return false;

  const requirementCount = player.city.reduce(
    (acc, curr) =>
      acc + (curr.effectType === event.effectTypeRequirement ? 1 : 0),
    0
  );

  // Cannot visit event that is already used
  if (event.used && workersVisiting > 0) return false;
  // Cannot visit event if requirement not met
  if (requirementCount < event.effectTypeCount) return false;

  return true;
}
