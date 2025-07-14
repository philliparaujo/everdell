import { events } from "../assets/data/events";
import { journeys } from "../assets/data/journey";
import { locations } from "../assets/data/locations";
import { powers } from "../assets/data/powers";
import { specialEvents } from "../assets/data/specialEvents";
import {
  FIRST_PLAYER_HAND_SIZE,
  MAX_BASE_CITY_SIZE,
  MAX_HAND_SIZE,
  MAX_LEGENDS_SIZE,
  MAX_MEADOW_SIZE,
  MAX_REVEAL_SIZE,
  RESOURCE_COUNT,
  SECOND_PLAYER_HAND_SIZE,
} from "../engine/gameConstants";
import {
  defaultCharacterCount,
  defaultPlayer,
  defaultPlayerCount,
  defaultResources,
} from "../engine/gameDefaults";
import {
  Card,
  CharacterType,
  EffectType,
  Event,
  ExpansionName,
  GameState,
  Journey,
  Location,
  Player,
  PlayerColor,
  ResourceCount,
  ResourceType,
  SpecialEvent,
  Visitable,
} from "../engine/gameTypes";
import { makeLegendsDecks, makeShuffledDeck } from "./card";
import { getPlayerColor } from "./identity";
import {
  countCardOccurrences,
  countEffectTypeOccurrences,
  hasCards,
  isOnSpecialEvents,
} from "./loops";
import { pickNRandom } from "./math";

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
  const scurrbleChampions = countCardOccurrences(city, "Scurrble Champion");
  const legends = city.reduce(
    (acc, curr) => acc + (curr.expansionName === "legends" ? 1 : 0),
    0,
  );
  const cardsUnderDungeon = city.reduce(
    (acc, curr) => acc + (curr.below === "Dungeon" ? 1 : 0),
    0,
  );

  return (
    MAX_BASE_CITY_SIZE +
    husbandWifePairs +
    wanderers +
    Math.max(0, scurrbleChampions - 1) +
    legends +
    cardsUnderDungeon
  );
}

export function computeResourceCount(state: GameState): ResourceCount {
  let baseCount = { ...RESOURCE_COUNT };
  for (const playerColor of Object.keys(state.players) as PlayerColor[]) {
    const player = state.players[playerColor];

    // Player resources
    for (const resource of Object.keys(RESOURCE_COUNT) as ResourceType[]) {
      baseCount[resource] -= player.resources[resource];
    }

    // Resources on city cards
    for (const card of player.city) {
      if (card.storage) {
        for (const resource of Object.keys(RESOURCE_COUNT) as ResourceType[]) {
          baseCount[resource] -= card.storage[resource];
        }
      }
    }
  }
  return baseCount;
}

export function sanityCheck(state: GameState): boolean {
  // Check player hand and city size
  for (const playerColor of Object.keys(state.players) as PlayerColor[]) {
    const player = state.players[playerColor];
    if (player.hand.length > MAX_HAND_SIZE) return false;
    if (player.city.length > computeMaxCitySize(player.city)) return false;
  }

  // Check meadow and reveal size
  if (state.meadow.length > MAX_MEADOW_SIZE) return false;
  if (state.reveal.length > MAX_REVEAL_SIZE) return false;

  // Check resource count
  const resourceCount = computeResourceCount(state);
  for (const resource of Object.keys(RESOURCE_COUNT) as ResourceType[]) {
    if (resourceCount[resource] < 0) return false;
  }

  // Check that previousState's previous state is null
  if (state.previousState && state.previousState.previousState) return false;

  return true;
}

export function setupGame(
  firstPlayer: PlayerColor,
  cardFrequencies: Record<ExpansionName, Record<string, number>>,
  activeExpansions: ExpansionName[],
  powersEnabled: boolean = false,
): GameState {
  // Shuffle deck
  const deck: Card[] = makeShuffledDeck(cardFrequencies);

  // Fill up meadow and deal cards
  const MEADOW_END = MAX_MEADOW_SIZE;
  const FIRST_END = MEADOW_END + FIRST_PLAYER_HAND_SIZE;
  const SECOND_END = FIRST_END + SECOND_PLAYER_HAND_SIZE;

  const meadow = deck.slice(0, MEADOW_END);
  const firstHand = deck.slice(MEADOW_END, FIRST_END);
  const secondHand = deck.slice(FIRST_END, SECOND_END);
  const remainingDeck = deck.slice(SECOND_END);

  // Deal Legends cards to players if Legends expansion is active
  let firstPlayerLegends: Card[] = [];
  let secondPlayerLegends: Card[] = [];
  if (activeExpansions.includes("legends")) {
    const { critters, constructions } = makeLegendsDecks(
      cardFrequencies["legends"],
    );
    const legendsPerPlayer = MAX_LEGENDS_SIZE;
    firstPlayerLegends = [
      ...critters.slice(0, legendsPerPlayer / 2),
      ...constructions.slice(0, legendsPerPlayer / 2),
    ];
    secondPlayerLegends = [
      ...critters.slice(legendsPerPlayer / 2, legendsPerPlayer),
      ...constructions.slice(legendsPerPlayer / 2, legendsPerPlayer),
    ];
  }

  // Set up remaining objects
  const newLocations: Location[] = locations.map((location) => ({
    ...location,
    workers: defaultPlayerCount,
    characters: powersEnabled ? defaultCharacterCount : null,
    storage: powersEnabled ? defaultResources : null,
  }));
  const newEvents: Event[] = events.map((event) => ({
    ...event,
    used: false,
    workers: defaultPlayerCount,
  }));
  const newSpecialEvents: SpecialEvent[] = pickNRandom(
    4,
    specialEvents.map((specialEvent) => ({
      ...specialEvent,
      used: false,
      workers: defaultPlayerCount,
    })),
  );

  const tempState: GameState = {
    players: {
      Red: {
        ...defaultPlayer,
        color: "Red",
        hand: firstPlayer === "Red" ? firstHand : secondHand,
        legends:
          firstPlayer === "Red" ? firstPlayerLegends : secondPlayerLegends,
      },
      Blue: {
        ...defaultPlayer,
        color: "Blue",
        hand: firstPlayer === "Blue" ? firstHand : secondHand,
        legends:
          firstPlayer === "Blue" ? firstPlayerLegends : secondPlayerLegends,
      },
    },
    deck: remainingDeck,
    discard: [],
    meadow: meadow,
    reveal: [],
    locations: newLocations,
    journeys: journeys,
    events: newEvents,
    specialEvents: newSpecialEvents,
    turn: firstPlayer,
    previousState: null,
    activeExpansions: activeExpansions,
    powersEnabled: powersEnabled,
  };

  const newState: GameState = {
    ...tempState,
    previousState: structuredClone(tempState),
  };

  return newState;
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

export function canPlaceCharacterOnLocation(
  state: GameState,
  location: Location,
  playerColor: PlayerColor,
  charactersVisiting: 1 | -1,
  character: CharacterType,
): boolean {
  if (
    location.characters !== null &&
    charactersVisiting < 0 &&
    location.characters[character] < Math.abs(charactersVisiting)
  )
    return false;

  switch (character) {
    case "Rat":
      return state.players[playerColor].power?.name === "Rats";
    case "Spider":
      return state.players[playerColor].power?.name === "Spiders";
    default:
      return false;
  }
}

export function canAddResourcesToLocation(
  state: GameState,
  location: Location,
  playerColor: PlayerColor,
): boolean {
  return (
    state.players[playerColor].power?.name === "Axolotls" &&
    location.storage !== null
  );
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
  const requirementCount = countEffectTypeOccurrences(
    player.city,
    event.effectTypeRequirement,
  );
  if (workersVisiting > 0 && requirementCount < event.effectTypeCount)
    return false;

  return true;
}

export function canAchieveEvent(
  state: GameState,
  event: Event,
  playerColor: PlayerColor,
): boolean {
  const player = state.players[playerColor];

  // Cannot achieve event that is already used
  if (event.used) return false;

  // Cannot achieve event if Amilla Glistendew is not in city
  if (countCardOccurrences(player.city, "Amilla Glistendew") === 0)
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

export function canAchieveSpecialEvent(
  state: GameState,
  specialEvent: SpecialEvent,
  playerColor: PlayerColor,
): boolean {
  const player = state.players[playerColor];

  // Cannot achieve special event that is already used
  if (specialEvent.used) return false;

  // Cannot achieve special event if Amilla Glistendew is not in city
  if (countCardOccurrences(player.city, "Amilla Glistendew") === 0)
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
  const greenCardsList: string[] = ["Teacher", "Town Crier"];
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
  const nonGreenCardsList: string[] = ["Cemetery", "Juggler"];
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

export function canSwapHands(
  state: GameState,
  playerColor: PlayerColor,
): boolean {
  // Cards and events that can swap hands
  const greenCardsList: string[] = [];
  const nonGreenCardsList: string[] = ["Rugwort the Robber"];
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

export function canStealCard(
  state: GameState,
  playerColor: PlayerColor,
): boolean {
  // Cards and events that can steal cards
  const greenCardsList: string[] = [];
  const nonGreenCardsList: string[] = ["Rugwort the Rowdy"];
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

export function canPlayToOppositeCity(
  state: GameState,
  playerColor: PlayerColor,
  card: Card,
): boolean {
  if (card.name === "Rugwort the Rowdy") return true;
  return false;
}

export function canMoveCardBelowInCity(
  state: GameState,
  playerColor: PlayerColor,
  card: Card,
  below: Card | null,
): boolean {
  // Can set below to null if card already has a below
  if (below === null) {
    if (card.below === null) return false;
    return true;
  }
  // Cannot set below to a card if card already has a below
  if (card.below !== null) return false;

  // Cannot set below to a card that is not in city
  if (!hasCards(state.players[playerColor].city, [below.name])) return false;

  // Any critter can be below a Dungeon
  if (card.cardType === "Critter") {
    if (["Dungeon"].includes(below.name)) return true;
  }

  // Bridge of the Sky and Silver Scale Spring can be below any Construction
  if (
    card.name === "Bridge of the Sky" ||
    card.name === "Silver Scale Spring"
  ) {
    if (below.cardType === "Construction" && card.name !== below.name)
      return true;
  }

  // Wife can be below Husband
  if (card.name === "Wife" && below.name === "Husband") return true;

  // Scurrble Champion will always be considered stacked to simplify grouping logic
  // if (card.name === "Scurrble Champion" && below.name === "Scurrble Champion")
  //   return true;

  return false;
}
