import { events } from "../assets/data/events";
import { journeys } from "../assets/data/journey";
import { locations } from "../assets/data/locations";
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
  Power,
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
  hasPowers,
  isOnSpecialEvents,
} from "./loops";
import { partition, pickNRandom } from "./math";

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

export function computeMaxCitySize(city: Card[], playerPower: Power | null) {
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
  const farms = countCardOccurrences(city, "Farm");

  return (
    MAX_BASE_CITY_SIZE +
    husbandWifePairs +
    wanderers +
    Math.max(0, scurrbleChampions - 1) +
    legends +
    cardsUnderDungeon +
    (hasPowers(playerPower, ["Pigs"]) ? farms : 0)
  );
}

export function computeMaxHandSize(
  state: GameState,
  playerColor: PlayerColor,
): number {
  const player = state.players[playerColor];
  switch (player.power?.name) {
    case "Butterflies":
      return 12;
    case "Starlings":
      return 11;
    case "Cardinals":
      return 10;
    case "Owls":
      return 9;
    default:
      return MAX_HAND_SIZE;
  }
}

export function computeStartingHandSize(
  playerColor: PlayerColor,
  power: Power | null,
): number {
  if (power && power.startingHandSize !== null) {
    return power.startingHandSize;
  }

  switch (playerColor) {
    case "Red":
      return FIRST_PLAYER_HAND_SIZE;
    case "Blue":
      return SECOND_PLAYER_HAND_SIZE;
  }
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
    if (player.hand.length > computeMaxHandSize(state, playerColor))
      return false;
    if (player.city.length > computeMaxCitySize(player.city, player.power))
      return false;
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
  redPower: Power | null = null,
): GameState {
  // Shuffle deck
  const deck: Card[] = makeShuffledDeck(cardFrequencies);

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
        power: redPower,
      },
      Blue: {
        ...defaultPlayer,
        color: "Blue",
      },
    },
    deck: deck,
    discard: [],
    meadow: [],
    reveal: [],
    farmStack: [],
    locations: newLocations,
    journeys: journeys,
    events: newEvents,
    specialEvents: newSpecialEvents,
    turn: firstPlayer,
    previousState: null,
    cardFrequencies: cardFrequencies,
    activeExpansions: activeExpansions,
    powersEnabled: powersEnabled,
  };

  return tempState;
}

export function dealCards(
  state: GameState,
  firstPlayer: PlayerColor,
  secondPlayer: PlayerColor,
): GameState {
  // Handle Pigs power: move all Farm cards into farmStack
  let farmStack: Card[] = [];
  let workingDeck = [...state.deck];
  if (isFarmStackEnabled(state)) {
    [farmStack, workingDeck] = partition(
      workingDeck,
      (card) => card.name === "Farm",
    );
  }

  // Fill up meadow and deal cards
  const MEADOW_END = MAX_MEADOW_SIZE;
  const FIRST_END =
    MEADOW_END +
    computeStartingHandSize(firstPlayer, state.players[firstPlayer].power);
  const SECOND_END =
    FIRST_END +
    computeStartingHandSize(secondPlayer, state.players[secondPlayer].power);

  const meadow = workingDeck.slice(0, MEADOW_END);
  const firstHand = workingDeck.slice(MEADOW_END, FIRST_END);
  const secondHand = workingDeck.slice(FIRST_END, SECOND_END);
  const remainingDeck = workingDeck.slice(SECOND_END);

  // Deal Legends cards to players if Legends expansion is active
  let firstPlayerLegends: Card[] = [];
  let secondPlayerLegends: Card[] = [];
  if (state.activeExpansions.includes("legends") && state.cardFrequencies) {
    const { critters, constructions } = makeLegendsDecks(
      state.cardFrequencies["legends"],
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

  const tempState: GameState = {
    ...state,
    players: {
      Red: {
        ...state.players["Red"],
        hand: firstPlayer === "Red" ? firstHand : secondHand,
        legends:
          firstPlayer === "Red" ? firstPlayerLegends : secondPlayerLegends,
      },
      Blue: {
        ...state.players["Blue"],
        hand: firstPlayer === "Blue" ? firstHand : secondHand,
        legends:
          firstPlayer === "Blue" ? firstPlayerLegends : secondPlayerLegends,
      },
    },
    deck: remainingDeck,
    meadow: meadow,
    farmStack: farmStack,
  };

  const newState: GameState = {
    ...tempState,
    previousState: structuredClone(tempState),
    cardFrequencies: null,
  };

  if (!sanityCheck(newState)) return state;
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

export function isFarmStackEnabled(state: GameState): boolean {
  const firstIsPigs = hasPowers(state.players["Red"].power, ["Pigs"]);
  const secondIsPigs = hasPowers(state.players["Blue"].power, ["Pigs"]);
  return (firstIsPigs || secondIsPigs) && state.powersEnabled;
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
  if (workersVisiting > 0 && location.exclusive && workersOnLocation > 0) {
    // ... unless they have the Cats power
    if (
      hasPowers(player.power, ["Cats"]) &&
      workersOnLocation - location.workers[playerColor] > 0
    ) {
      return true;
    }
    return false;
  }

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
    case "rat":
      return hasPowers(state.players[playerColor].power, ["Rats"]);
    case "spider":
      return hasPowers(state.players[playerColor].power, ["Spiders"]);
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
    hasPowers(state.players[playerColor].power, ["Axolotls"]) &&
    location.storage !== null
  );
}

export function canAddResourcesToPower(
  state: GameState,
  power: Power,
  playerColor: PlayerColor,
): boolean {
  return (
    hasPowers(state.players[playerColor].power, ["Platypuses", "Turtles"]) &&
    power.storage !== null
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
  if (newWorkersOnCard > card.maxDestinations) {
    // ... unless they have the Cats power
    if (
      hasPowers(player.power, ["Cats"]) &&
      card.activeDestinations - card.workers[playerColor] > 0
    ) {
      return true;
    }
    return false;
  }

  return true;
}

function hasPermission(
  state: GameState,
  playerColor: PlayerColor,
  greenCardsList: string[],
  nonGreenCardsList: string[],
  givesOpponentPermissionList: string[],
  specialEventsList: string[],
  powersList: string[],
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
    isOnSpecialEvents(player, specialEvents, specialEventsList) ||
    hasPowers(player.power, powersList)
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
  const powersList: string[] = ["Platypuses", "Starlings"];

  return hasPermission(
    state,
    playerColor,
    greenCardsList,
    nonGreenCardsList,
    givesOpponentPermissionList,
    specialEventsList,
    powersList,
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
  const powersList: string[] = ["Owls"];

  return hasPermission(
    state,
    playerColor,
    greenCardsList,
    nonGreenCardsList,
    givesOpponentPermissionList,
    specialEventsList,
    powersList,
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
  const powersList: string[] = [];

  return hasPermission(
    state,
    playerColor,
    greenCardsList,
    nonGreenCardsList,
    givesOpponentPermissionList,
    specialEventsList,
    powersList,
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
  const powersList: string[] = [];

  return hasPermission(
    state,
    playerColor,
    greenCardsList,
    nonGreenCardsList,
    givesOpponentPermissionList,
    specialEventsList,
    powersList,
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
  const powersList: string[] = [];

  return hasPermission(
    state,
    playerColor,
    greenCardsList,
    nonGreenCardsList,
    givesOpponentPermissionList,
    specialEventsList,
    powersList,
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
  const powersList: string[] = [];

  return hasPermission(
    state,
    playerColor,
    greenCardsList,
    nonGreenCardsList,
    givesOpponentPermissionList,
    specialEventsList,
    powersList,
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
  const powersList: string[] = [];

  return hasPermission(
    state,
    playerColor,
    greenCardsList,
    nonGreenCardsList,
    givesOpponentPermissionList,
    specialEventsList,
    powersList,
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
