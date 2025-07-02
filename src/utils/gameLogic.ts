import { MAX_BASE_CITY_SIZE, MAX_MEADOW_SIZE } from "../engine/gameConstants";
import {
  Card,
  EffectType,
  Event,
  GameState,
  Journey,
  Location,
  Player,
  PlayerColor,
  SpecialEvent,
  Visitable,
} from "../engine/gameTypes";
import { getPlayerColor } from "./identity";
import {
  countCardOccurrences,
  countEffectTypeOccurrences,
  hasCards,
  isOnSpecialEvents,
} from "./loops";

export function oppositePlayerOf(playerColor: PlayerColor): PlayerColor {
  return playerColor === "Red" ? "Blue" : "Red";
}

export function isNotYourTurn(
  game: GameState,
  playerId: string | null,
): boolean {
  return getPlayerColor(game, playerId) !== game.turn;
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

export function computeMaxCitySize(city: Card[]) {
  const husbandWifePairs = Math.min(
    countCardOccurrences(city, "Husband"),
    countCardOccurrences(city, "Wife"),
  );
  const wanderers = countCardOccurrences(city, "Wanderer");

  return MAX_BASE_CITY_SIZE + husbandWifePairs + wanderers;
}

function canVisitGeneric(
  player: Player,
  location: Visitable,
  workersVisiting: 1 | -1,
): boolean {
  const newWorkersLeft = player.workers.workersLeft - workersVisiting;

  // Cannot end with negative workers or more than max available
  if (newWorkersLeft < 0 || newWorkersLeft > player.workers.maxWorkers)
    return false;

  // Cannot take away more workers than are on the location
  if (
    workersVisiting < 0 &&
    location.workers[player.color] < Math.abs(workersVisiting)
  )
    return false;

  return true;
}

export function canVisitLocation(
  state: GameState,
  location: Location,
  playerColor: PlayerColor,
  workersVisiting: 1 | -1,
): boolean {
  const player = state.players[playerColor];
  if (!canVisitGeneric(player, location, workersVisiting)) return false;

  // Cannot visit exclusive location with a worker already on it
  const workersOnLocation = location.workers.Red + location.workers.Blue;
  if (workersVisiting > 0 && location.exclusive && workersOnLocation > 0)
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
  if (!canVisitGeneric(player, journey, workersVisiting)) return false;

  // Cannot visit exclusive journey with a worker already on it
  const workersOnJourney = journey.workers.Red + journey.workers.Blue;
  if (workersVisiting > 0 && journey.exclusive && workersOnJourney > 0)
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
  if (!canVisitGeneric(player, event, workersVisiting)) return false;

  // Cannot visit event that is already used
  if (workersVisiting > 0 && event.used) return false;

  // Cannot visit event if requirement not met
  const requirementCount = player.city.reduce(
    (acc, curr) =>
      acc + (curr.effectType === event.effectTypeRequirement ? 1 : 0),
    0,
  );
  if (workersVisiting > 0 && requirementCount < event.effectTypeCount)
    return false;

  return true;
}

export function canVisitSpecialEvent(
  state: GameState,
  specialEvent: SpecialEvent,
  playerColor: PlayerColor,
  workersVisiting: 1 | -1,
): boolean {
  const player = state.players[playerColor];
  if (!canVisitGeneric(player, specialEvent, workersVisiting)) return false;

  // Cannot visit special event that is already used
  if (workersVisiting > 0 && specialEvent.used) return false;

  // Cannot visit special event if requirement not met
  // Assumes cardRequirement list has no duplicate card names
  const cardRequirementMet = specialEvent.cardRequirement
    .map((cardName) => hasCards(player.city, [cardName]))
    .reduce((acc, curr) => acc && curr, true);
  const effectTypeRequirementMet = Object.entries(
    specialEvent.effectTypeRequirement,
  ).every(
    ([effectType, required]) =>
      countEffectTypeOccurrences(player.city, effectType as EffectType) >=
      required,
  );
  if (workersVisiting > 0 && (!cardRequirementMet || !effectTypeRequirementMet))
    return false;

  return true;
}

export function canVisitCardInCity(
  state: GameState,
  card: Card,
  playerColor: PlayerColor,
  workersVisiting: 1 | -1,
): boolean {
  const player = state.players[playerColor];
  if (!canVisitGeneric(player, card, workersVisiting)) return false;

  // Cannot interact with card that doesn't have destinations
  if (card.maxDestinations === null || card.activeDestinations == null)
    return false;

  // Cannot end with more workers on card than max destinations
  const newWorkersOnCard = card.activeDestinations + workersVisiting;
  if (newWorkersOnCard > card.maxDestinations) return false;

  return true;
}

function hasPermission(
  state: GameState,
  playerColor: PlayerColor,
  greenCardsList: string[],
  nonGreenCardsList: string[],
  givesOpponentPermissionList: string[],
  specialEventsList: string[],
): boolean {
  const player = state.players[playerColor];
  const oppositePlayer = state.players[oppositePlayerOf(playerColor)];
  const specialEvents = state.specialEvents;

  const canCopyGreenCardsList = ["Miner Mole"];

  return (
    hasCards(player.city, [...greenCardsList, ...nonGreenCardsList]) ||
    hasCards(oppositePlayer.city, givesOpponentPermissionList) ||
    (hasCards(player.city, canCopyGreenCardsList) &&
      hasCards(oppositePlayer.city, greenCardsList)) ||
    isOnSpecialEvents(player, specialEvents, specialEventsList)
  );
}

export function canGiveToSelf(
  state: GameState,
  playerColor: PlayerColor,
): boolean {
  // Cards and events that can give cards to self
  const greenCardsList: string[] = [];
  const nonGreenCardsList: string[] = ["Undertaker"];
  const givesOpponentPermissionList: string[] = [];

  const specialEventsList: string[] = [
    "A Brilliant Marketing Plan",
    "Ancient Scrolls Discovered",
  ];

  return hasPermission(
    state,
    playerColor,
    greenCardsList,
    nonGreenCardsList,
    givesOpponentPermissionList,
    specialEventsList,
  );
}

export function canGiveToOpponent(
  state: GameState,
  playerColor: PlayerColor,
): boolean {
  // Cards and events that can give cards to opponent
  const greenCardsList: string[] = ["Teacher"];
  const nonGreenCardsList: string[] = ["Post Office"];
  const givesOpponentPermissionList: string[] = ["Post Office"];
  const specialEventsList: string[] = [];

  return hasPermission(
    state,
    playerColor,
    greenCardsList,
    nonGreenCardsList,
    givesOpponentPermissionList,
    specialEventsList,
  );
}

export function canRevealDeck(
  state: GameState,
  playerColor: PlayerColor,
): boolean {
  // Cards and events that can reveal deck
  const greenCardsList: string[] = ["Postal Pigeon"];
  const nonGreenCardsList: string[] = ["Cemetery"];
  const givesOpponentPermissionList: string[] = [];
  const specialEventsList: string[] = ["Ancient Scrolls Discovered"];

  return hasPermission(
    state,
    playerColor,
    greenCardsList,
    nonGreenCardsList,
    givesOpponentPermissionList,
    specialEventsList,
  );
}

export function canRevealDiscard(
  state: GameState,
  playerColor: PlayerColor,
): boolean {
  // Cards and events that can reveal discard
  const greenCardsList: string[] = [];
  const nonGreenCardsList: string[] = ["Cemetery"];
  const givesOpponentPermissionList: string[] = [];
  const specialEventsList: string[] = [];

  return hasPermission(
    state,
    playerColor,
    greenCardsList,
    nonGreenCardsList,
    givesOpponentPermissionList,
    specialEventsList,
  );
}

export function canGiveResources(
  state: GameState,
  playerColor: PlayerColor,
): boolean {
  // Cards and events that can give resources
  const greenCardsList: string[] = ["Monk"];
  const nonGreenCardsList: string[] = ["Monastery", "Shepherd"];
  const givesOpponentPermissionList: string[] = [];
  const specialEventsList: string[] = ["A Brilliant Marketing Plan"];

  return hasPermission(
    state,
    playerColor,
    greenCardsList,
    nonGreenCardsList,
    givesOpponentPermissionList,
    specialEventsList,
  );
}
