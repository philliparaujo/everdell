import { powers } from "../assets/data/powers";
import {
  canAchieveEvent,
  canAchieveSpecialEvent,
  canAddResourcesToLocation,
  canAddResourcesToPower,
  canMoveCardBelowInCity,
  canPlaceCharacterOnLocation,
  canPlayToOppositeCity,
  canSwapHands,
  canVisitCardInCity,
  canVisitEvent,
  canVisitJourney,
  canVisitLocation,
  canVisitSpecialEvent,
  computeMaxHandSize,
  isSafeToEndTurn,
  oppositePlayerOf,
  sanityCheck,
} from "../utils/gameLogic";
import { getPlayerColor } from "../utils/identity";
import { countCardOccurrences, hasCards, sortCity } from "../utils/loops";
import { partition } from "../utils/math";
import { MAX_MEADOW_SIZE, MAX_REVEAL_SIZE } from "./gameConstants";
import { defaultResources } from "./gameDefaults";
import {
  Action,
  Card,
  CharacterType,
  GameState,
  History,
  Location,
  Player,
  PlayerColor,
  Power,
  ResourceCount,
  Season,
} from "./gameTypes";

export function endTurn(state: GameState, playerId: string | null): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  if (!isSafeToEndTurn(state)) return state;

  const updatedOpponentHistory: History = {
    discarded: [],
    cityDiscarded: [],
    drew: [],
    played: [],
    gave: [],
    resources: state.players[oppositePlayerOf(state.turn)].resources,
    workers: state.players[oppositePlayerOf(state.turn)].workers,
    season: state.players[oppositePlayerOf(state.turn)].season,
  };

  const newState: GameState = {
    ...state,
    turn: oppositePlayerOf(state.turn),
    players: {
      ...state.players,
      [oppositePlayerOf(state.turn)]: {
        ...state.players[oppositePlayerOf(state.turn)],
        history: updatedOpponentHistory,
      },
    },
    previousState: structuredClone({
      ...state,
      turn: oppositePlayerOf(state.turn),
      previousState: null,
    }),
  };

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function resetTurn(
  state: GameState,
  playerId: string | null,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  if (!state.previousState) return state;

  const { previousState } = state;
  let newState: GameState = {
    ...state.previousState,
    previousState,
    players: {
      ...state.previousState.players,
      [playerColor]: {
        ...state.previousState.players[playerColor],
        history: {
          ...state.previousState.players[playerColor].history,
          discarded: [],
          cityDiscarded: [],
          drew: [],
          played: [],
          gave: [],
        },
      },
    },
  };

  // Preserve id, name, and color for all players
  for (const color of Object.keys(
    state.players,
  ) as (keyof typeof state.players)[]) {
    newState.players[color] = {
      ...newState.players[color],
      id: state.players[color].id,
      name: state.players[color].name,
      color: state.players[color].color,
    };
  }

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function revealCard(
  state: GameState,
  playerId: string | null,
  location: "deck" | "discard",
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  const reveal: Card[] = [...state.reveal];
  if (reveal.length >= MAX_REVEAL_SIZE) return state;

  if (location === "deck") {
    if (state.deck.length === 0) return state;

    const deck = [...state.deck];
    const topCard = deck.pop();
    if (!topCard) return state;

    const newState: GameState = {
      ...state,
      deck,
      reveal: [...reveal, topCard],
    };

    if (!sanityCheck(newState)) return state;
    return newState;
  }

  if (location === "discard") {
    if (state.discard.length === 0) return state;

    const discard = [...state.discard];
    const index = Math.floor(Math.random() * discard.length);
    const [chosen] = discard.splice(index, 1);

    const newState: GameState = {
      ...state,
      discard,
      reveal: [...reveal, chosen],
    };

    if (!sanityCheck(newState)) return state;
    return newState;
  }

  return state;
}

export function harvest(state: GameState, playerId: string | null): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  const player = state.players[playerColor];
  const { season } = player;

  let newSeason: Season = season;
  let maxWorkers;

  if (season === "Winter") {
    newSeason = "Spring";
    maxWorkers = 3;
  } else if (season === "Spring") {
    newSeason = "Summer";
    maxWorkers = 4;
  } else if (season === "Summer") {
    newSeason = "Autumn";
    maxWorkers = 6;
  } else {
    return state;
  }

  const workersLost = player.city.reduce((acc, card) => {
    return acc + (card.name === "Cemetery" ? card.workers[playerColor] : 0);
  }, 0);

  const updatedPlayer: Player = {
    ...player,
    season: newSeason,
    workers: {
      maxWorkers: maxWorkers,
      workersLeft: maxWorkers - workersLost,
    },
    city: player.city.map((card) => ({
      ...card,
      activeDestinations:
        card.name === "Cemetery" ? card.workers[playerColor] : 0,
      workers: {
        ...card.workers,
        [playerColor]: card.name === "Cemetery" ? card.workers[playerColor] : 0,
      },
    })),
  };

  const newState: GameState = {
    ...state,
    players: {
      ...state.players,
      [playerColor]: updatedPlayer,
      [oppositePlayerOf(playerColor)]: {
        ...state.players[oppositePlayerOf(playerColor)],
        city: state.players[oppositePlayerOf(playerColor)].city.map((card) => ({
          ...card,
          workers: {
            ...card.workers,
            [playerColor]: 0,
          },
        })),
      },
    },
    locations: state.locations.map((location) => ({
      ...location,
      workers: {
        ...location.workers,
        [playerColor]: 0,
      },
    })),
    journeys: state.journeys.map((journey) => ({
      ...journey,
      workers: {
        ...journey.workers,
        [playerColor]: 0,
      },
    })),
    events: state.events.map((event) => ({
      ...event,
      workers: {
        ...event.workers,
        [playerColor]: 0,
      },
    })),
    specialEvents: state.specialEvents.map((specialEvent) => ({
      ...specialEvent,
      workers: {
        ...specialEvent.workers,
        [playerColor]: 0,
      },
    })),
  };

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function drawCard(state: GameState, playerId: string | null): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  const deck: Card[] = [...state.deck];

  if (deck.length === 0) {
    return state;
  }
  if (
    state.players[playerColor].hand.length >=
    computeMaxHandSize(state, playerColor)
  ) {
    return state;
  }

  const topCard: Card | undefined = deck.pop();
  if (!topCard) {
    return state;
  }

  const players = { ...state.players };
  players[playerColor] = {
    ...players[playerColor],
    hand: [...players[playerColor].hand, topCard],
    history: {
      ...players[playerColor].history,
      drew: [...players[playerColor].history.drew, topCard],
    },
  };

  const newState: GameState = {
    ...state,
    deck,
    players,
  };

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function swapHands(
  state: GameState,
  playerId: string | null,
  toColor: PlayerColor,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  if (!canSwapHands(state, playerColor)) return state;

  const updatedPlayers: Record<PlayerColor, Player> = {
    ...state.players,
    [playerColor]: {
      ...state.players[playerColor],
      hand: state.players[toColor].hand,
    },
    [toColor]: {
      ...state.players[toColor],
      hand: state.players[playerColor].hand,
    },
  };

  const newState: GameState = {
    ...state,
    players: updatedPlayers,
  };

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function refillMeadow(
  state: GameState,
  playerId: string | null,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  const deck: Card[] = [...state.deck];
  const meadow: Card[] = [...state.meadow];

  if (deck.length === 0) {
    return state;
  }
  if (meadow.length >= MAX_MEADOW_SIZE) {
    return state;
  }

  const slotsOpen = MAX_MEADOW_SIZE - meadow.length;
  const numToTake = Math.min(slotsOpen, deck.length);
  const topCards = deck.splice(deck.length - numToTake, numToTake);

  const newState: GameState = {
    ...state,
    deck,
    meadow: [...state.meadow, ...topCards],
  };

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function visitLocation(
  state: GameState,
  playerId: string | null,
  index: number,
  workersVisiting: 1 | -1,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  if (index >= state.locations.length) return state;
  const location = state.locations[index];
  const player = state.players[playerColor];

  if (!canVisitLocation(state, location, playerColor, workersVisiting))
    return state;

  const updatedLocation = {
    ...location,
    workers: {
      ...location.workers,
      [playerColor]: location.workers[playerColor] + workersVisiting,
    },
  };

  const updatedPlayers: Record<PlayerColor, Player> = {
    ...state.players,
    [playerColor]: {
      ...player,
      workers: {
        ...player.workers,
        workersLeft: player.workers.workersLeft - workersVisiting,
      },
      resources: {
        ...player.resources,
      },
    },
  };

  const newState: GameState = {
    ...state,
    locations: state.locations.map((loc, i) =>
      i === index ? updatedLocation : loc,
    ),
    players: updatedPlayers,
  };

  if (workersVisiting > 0) {
    return addResourcesToSelf(newState, playerId, location.resources);
  }

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function visitJourney(
  state: GameState,
  playerId: string | null,
  index: number,
  workersVisiting: 1 | -1,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  if (index >= state.journeys.length) return state;
  const journey = state.journeys[index];
  const player = state.players[playerColor];

  if (!canVisitJourney(state, journey, playerColor, workersVisiting))
    return state;

  const updatedJourney = {
    ...journey,
    workers: {
      ...journey.workers,
      [playerColor]: journey.workers[playerColor] + workersVisiting,
    },
  };

  const updatedPlayers: Record<PlayerColor, Player> = {
    ...state.players,
    [playerColor]: {
      ...player,
      workers: {
        ...player.workers,
        workersLeft: player.workers.workersLeft - workersVisiting,
      },
      resources: {
        ...player.resources,
      },
    },
  };

  const newState: GameState = {
    ...state,
    journeys: state.journeys.map((journey, i) =>
      i === index ? updatedJourney : journey,
    ),
    players: updatedPlayers,
  };

  if (workersVisiting > 0) {
    return addResourcesToSelf(newState, playerId, {
      ...defaultResources,
      coins: journey.value,
    });
  }

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function visitEvent(
  state: GameState,
  playerId: string | null,
  index: number,
  workersVisiting: 1 | -1,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  if (index >= state.events.length) return state;
  const event = state.events[index];
  const player = state.players[playerColor];

  if (!canVisitEvent(state, event, playerColor, workersVisiting)) return state;

  const updatedEvent = {
    ...event,
    workers: {
      ...event.workers,
      [playerColor]: event.workers[playerColor] + workersVisiting,
    },
    used: true,
  };

  const updatedPlayers: Record<PlayerColor, Player> = {
    ...state.players,
    [playerColor]: {
      ...player,
      workers: {
        ...player.workers,
        workersLeft: player.workers.workersLeft - workersVisiting,
      },
      resources: {
        ...player.resources,
      },
    },
  };

  const newState: GameState = {
    ...state,
    events: state.events.map((event, i) =>
      i === index ? updatedEvent : event,
    ),
    players: updatedPlayers,
  };

  if (workersVisiting > 0) {
    return addResourcesToSelf(newState, playerId, {
      ...defaultResources,
      coins: event.value,
    });
  }

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function visitSpecialEvent(
  state: GameState,
  playerId: string | null,
  index: number,
  workersVisiting: 1 | -1,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  if (index >= state.specialEvents.length) return state;
  const specialEvent = state.specialEvents[index];
  const player = state.players[playerColor];

  if (!canVisitSpecialEvent(state, specialEvent, playerColor, workersVisiting))
    return state;

  const updatedSpecialEvent = {
    ...specialEvent,
    workers: {
      ...specialEvent.workers,
      [playerColor]: specialEvent.workers[playerColor] + workersVisiting,
    },
    used: true,
  };

  const updatedPlayers: Record<PlayerColor, Player> = {
    ...state.players,
    [playerColor]: {
      ...player,
      workers: {
        ...player.workers,
        workersLeft: player.workers.workersLeft - workersVisiting,
      },
      resources: {
        ...player.resources,
      },
    },
  };

  const newState: GameState = {
    ...state,
    specialEvents: state.specialEvents.map((specialEvent, i) =>
      i === index ? updatedSpecialEvent : specialEvent,
    ),
    players: updatedPlayers,
  };

  if (workersVisiting > 0 && specialEvent.value) {
    return addResourcesToSelf(newState, playerId, {
      ...defaultResources,
      coins: specialEvent.value,
    });
  }

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function visitCardInCity(
  state: GameState,
  playerId: string | null,
  cityColor: PlayerColor,
  index: number,
  workersVisiting: 1 | -1,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  if (index >= state.players[cityColor].city.length) return state;
  const card = state.players[cityColor].city[index];
  const player = state.players[playerColor];

  if (!canVisitCardInCity(state, card, playerColor, workersVisiting))
    return state;

  const updatedCard: Card = {
    ...card,
    activeDestinations: card.activeDestinations!! + workersVisiting,
    workers: {
      ...card.workers,
      [playerColor]: card.workers[playerColor] + workersVisiting,
    },
  };
  const updatedCity = state.players[cityColor].city.map((c, i) =>
    i === index ? updatedCard : c,
  );

  const updatedPlayer: Player = {
    ...player,
    ...(playerColor === cityColor && { city: updatedCity }),
    workers: {
      ...player.workers,
      workersLeft: player.workers.workersLeft - workersVisiting,
    },
  };

  const newState: GameState = {
    ...state,
    players: {
      ...state.players,
      [playerColor]: updatedPlayer,
      ...(playerColor !== cityColor && {
        [cityColor]: {
          ...state.players[cityColor],
          city: updatedCity,
        },
      }),
    },
  };

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function achieveEvent(
  state: GameState,
  playerId: string | null,
  index: number,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  if (index >= state.events.length) return state;
  const event = state.events[index];

  if (!canAchieveEvent(state, event, playerColor)) return state;

  const updatedEvent = { ...event, used: true };
  const newState: GameState = {
    ...state,
    events: state.events.map((event, i) =>
      i === index ? updatedEvent : event,
    ),
  };

  return addResourcesToSelf(newState, playerId, {
    ...defaultResources,
    coins: event.value,
  });
}

export function achieveSpecialEvent(
  state: GameState,
  playerId: string | null,
  index: number,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  if (index >= state.specialEvents.length) return state;
  const specialEvent = state.specialEvents[index];

  if (!canAchieveSpecialEvent(state, specialEvent, playerColor)) return state;

  const updatedSpecialEvent = { ...specialEvent, used: true };
  const newState: GameState = {
    ...state,
    specialEvents: state.specialEvents.map((specialEvent, i) =>
      i === index ? updatedSpecialEvent : specialEvent,
    ),
  };

  if (specialEvent.value) {
    return addResourcesToSelf(newState, playerId, {
      ...defaultResources,
      coins: specialEvent.value,
    });
  }

  if (!sanityCheck(newState)) return state;
  return newState;
}

function setAction(
  state: GameState,
  playerId: string | null,
  action: Action,
  value: boolean,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;
  for (const otherAction of ["discarding", "playing", "giving"]) {
    if (
      state.players[playerColor][otherAction as keyof Player] &&
      otherAction !== action
    ) {
      return state;
    }
  }
  if (state.players[playerColor][action] === value) return state;

  const players = { ...state.players };
  players[playerColor] = { ...players[playerColor], [action]: value };

  const newState: GameState = {
    ...state,
    players,
  };

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function setDiscarding(
  state: GameState,
  playerId: string | null,
  discarding: boolean,
): GameState {
  return setAction(state, playerId, "discarding", discarding);
}

export function setPlaying(
  state: GameState,
  playerId: string | null,
  playing: boolean,
): GameState {
  return setAction(state, playerId, "playing", playing);
}

export function setGiving(
  state: GameState,
  playerId: string | null,
  giving: boolean,
): GameState {
  return setAction(state, playerId, "giving", giving);
}

function toggleCardAction(
  state: GameState,
  playerId: string | null,
  location:
    | "hand"
    | "city"
    | "meadow"
    | "reveal"
    | "discard"
    | "legends"
    | "farmStack",
  index: number,
  action: Action,
  fromCityColor: PlayerColor | null = null,
) {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  const newState: GameState = {
    ...state,
    players: {
      ...state.players,
      [playerColor]: {
        ...state.players[playerColor],
        hand: [...state.players[playerColor].hand],
        city: [...state.players[playerColor].city],
        legends: [...state.players[playerColor].legends],
      },
      ...(fromCityColor !== null && {
        [fromCityColor]: {
          ...state.players[fromCityColor],
          city: [...state.players[fromCityColor].city],
        },
      }),
    },
    meadow: [...state.meadow],
    reveal: [...state.reveal],
    discard: [...state.discard],
    farmStack: [...state.farmStack],
  };

  let cardToToggle: Card | undefined;

  if (location === "hand") {
    cardToToggle = state.players[playerColor].hand[index];
    if (cardToToggle) {
      newState.players[playerColor].hand[index] = {
        ...cardToToggle,
        [action]: !cardToToggle[action],
      };
    }
  } else if (location === "city" && fromCityColor !== null) {
    cardToToggle = state.players[fromCityColor].city[index];
    if (cardToToggle) {
      newState.players[fromCityColor].city[index] = {
        ...cardToToggle,
        [action]: !cardToToggle[action],
      };
    }
  } else if (location === "city") {
    cardToToggle = state.players[playerColor].city[index];
    if (cardToToggle) {
      newState.players[playerColor].city[index] = {
        ...cardToToggle,
        [action]: !cardToToggle[action],
      };
    }
  } else if (location === "meadow") {
    cardToToggle = state.meadow[index];
    if (cardToToggle) {
      newState.meadow[index] = {
        ...cardToToggle,
        [action]: !cardToToggle[action],
      };
    }
  } else if (location === "reveal") {
    cardToToggle = state.reveal[index];
    if (cardToToggle) {
      newState.reveal[index] = {
        ...cardToToggle,
        [action]: !cardToToggle[action],
      };
    }
  } else if (location === "discard") {
    cardToToggle = state.discard[index];
    if (cardToToggle) {
      newState.discard[index] = {
        ...cardToToggle,
        [action]: !cardToToggle[action],
      };
    }
  } else if (location === "legends") {
    cardToToggle = state.players[playerColor].legends[index];
    if (cardToToggle) {
      newState.players[playerColor].legends[index] = {
        ...cardToToggle,
        [action]: !cardToToggle[action],
      };
    }
  } else if (location === "farmStack") {
    cardToToggle = state.farmStack[index];
    if (cardToToggle) {
      newState.farmStack[index] = {
        ...cardToToggle,
        [action]: !cardToToggle[action],
      };
    }
  }

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function toggleCardDiscarding(
  state: GameState,
  playerId: string | null,
  location: "hand" | "city" | "meadow" | "reveal",
  index: number,
): GameState {
  return toggleCardAction(state, playerId, location, index, "discarding", null);
}

export function toggleCardPlaying(
  state: GameState,
  playerId: string | null,
  location:
    | "hand"
    | "meadow"
    | "discard"
    | "reveal"
    | "legends"
    | "city"
    | "farmStack",
  index: number,
  fromCityColor: PlayerColor | null,
): GameState {
  if (location === "city" && fromCityColor === null) return state;
  return toggleCardAction(
    state,
    playerId,
    location,
    index,
    "playing",
    fromCityColor,
  );
}

export function toggleCardGiving(
  state: GameState,
  playerId: string | null,
  location: "hand" | "meadow" | "reveal",
  index: number,
): GameState {
  return toggleCardAction(state, playerId, location, index, "giving", null);
}

function updateCardsBelow(
  state: GameState,
  playerColor: PlayerColor,
): GameState {
  const player = state.players[playerColor];
  const city = player.city;

  const hasDungeon = hasCards(city, ["Dungeon"]);
  const wifeCount = countCardOccurrences(city, "Wife");
  const husbandCount = countCardOccurrences(city, "Husband");
  const maxPairs = Math.min(wifeCount, husbandCount);

  let pairsFormed = 0;

  const updatedCity = city.map((card) => {
    // Always keep dungeon attachments
    if (card.below === "Dungeon" && hasDungeon) {
      return { ...card, below: "Dungeon" };
    }

    // Pair wives under husbands
    if (card.name === "Wife") {
      if (pairsFormed < maxPairs) {
        pairsFormed++;
        return { ...card, below: "Husband" };
      }
      return { ...card, below: null };
    }

    // Husbands should never sit under wives
    if (card.name === "Husband") {
      return { ...card, below: null };
    }

    // Clear invalid dungeon attachments
    if (card.below === "Dungeon" && !hasDungeon) {
      return { ...card, below: null };
    }

    return card;
  });

  return {
    ...state,
    players: {
      ...state.players,
      [playerColor]: {
        ...player,
        city: updatedCity,
      },
    },
  };
}

export function playCard(
  state: GameState,
  playerId: string | null,
  location: "hand" | "meadow" | "discard" | "reveal" | "legends" | "farmStack",
  index: number,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  let newState: GameState = {
    ...state,
    players: {
      ...state.players,
      [playerColor]: {
        ...state.players[playerColor],
        hand: [...state.players[playerColor].hand],
        city: [...state.players[playerColor].city],
        legends: [...state.players[playerColor].legends],
      },
    },
    meadow: [...state.meadow],
    reveal: [...state.reveal],
    discard: [...state.discard],
  };

  let cardToPlay: Card | undefined;

  if (location === "hand") {
    if (index >= state.players[playerColor].hand.length) return state;
    cardToPlay = state.players[playerColor].hand[index];

    newState.players[playerColor].hand = newState.players[
      playerColor
    ].hand.filter((_, i) => i !== index);
  } else if (location === "meadow") {
    if (index >= state.meadow.length) return state;
    cardToPlay = state.meadow[index];

    newState.meadow = newState.meadow.filter((_, i) => i !== index);
  } else if (location === "discard") {
    if (index >= state.discard.length) return state;
    cardToPlay = state.discard[index];

    newState.discard = newState.discard.filter((_, i) => i !== index);
  } else if (location === "reveal") {
    if (index >= state.reveal.length) return state;
    cardToPlay = state.reveal[index];

    newState.reveal = newState.reveal.filter((_, i) => i !== index);
  } else if (location === "legends") {
    if (index >= state.players[playerColor].legends.length) return state;
    cardToPlay = state.players[playerColor].legends[index];

    newState.players[playerColor].legends = newState.players[
      playerColor
    ].legends.filter((_, i) => i !== index);
  } else if (location === "farmStack") {
    if (index > 0 || state.farmStack.length === 0) return state;
    cardToPlay = state.farmStack[index];

    newState.farmStack = newState.farmStack.filter((_, i) => i !== index);
  }

  if (!cardToPlay) return state;
  const updatedCard: Card = {
    ...cardToPlay,
    playing: false,
    discarding: false,
    giving: false,
    below: null,
  };

  // Determine which player's city to add the card to
  const targetPlayerColor =
    updatedCard.name === "Fool" ? oppositePlayerOf(playerColor) : playerColor;

  // Update the state with the new city
  newState.players[targetPlayerColor] = {
    ...newState.players[targetPlayerColor],
    city: sortCity([...newState.players[targetPlayerColor].city, updatedCard]),
  };

  newState.players[playerColor] = {
    ...newState.players[playerColor],
    history: updatedHistoryOnAction(
      state,
      playerColor,
      "playing",
      [cardToPlay],
      [],
      [],
      [],
      [],
      [],
      [],
      [],
    ),
  };

  newState = updateCardsBelow(newState, playerColor);
  if (!sanityCheck(newState)) return state;
  return newState;
}

export function playToOppositeCity(
  state: GameState,
  playerId: string | null,
  index: number,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  if (index >= state.players[playerColor].city.length) return state;
  const card = state.players[playerColor].city[index];

  if (!canPlayToOppositeCity(state, playerColor, card)) return state;

  const player = state.players[playerColor];
  const oppositePlayer = state.players[oppositePlayerOf(playerColor)];

  const updatedCity = state.players[playerColor].city.filter(
    (_, i) => i !== index,
  );
  const updatedOppositeCity = [
    ...oppositePlayer.city,
    { ...card, playing: false, discarding: false, giving: false },
  ];

  const newState: GameState = {
    ...state,
    players: {
      ...state.players,
      [playerColor]: { ...player, city: updatedCity },
      [oppositePlayerOf(playerColor)]: {
        ...oppositePlayer,
        city: updatedOppositeCity,
      },
    },
  };

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function moveCardBelowInCity(
  state: GameState,
  playerId: string | null,
  index: number,
  below: Card | null,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  if (index >= state.players[playerColor].city.length) return state;
  const card = state.players[playerColor].city[index];

  if (!canMoveCardBelowInCity(state, playerColor, card, below)) return state;

  const updatedCard: Card = {
    ...card,
    below: below?.name ?? null,
  };
  const updatedCity = state.players[playerColor].city.map((c, i) =>
    i === index ? updatedCard : c,
  );

  const newState: GameState = {
    ...state,
    players: {
      ...state.players,
      [playerColor]: { ...state.players[playerColor], city: updatedCity },
    },
  };

  if (!sanityCheck(newState)) return state;
  return newState;
}

function updatedHistoryOnAction(
  state: GameState,
  playerColor: PlayerColor,
  action: Action,
  handAct: Card[],
  cityAct: Card[],
  meadowAct: Card[],
  revealAct: Card[],
  discardAct: Card[],
  legendsAct: Card[],
  farmStackAct: Card[],
  oppositeCityAct: Card[],
): History {
  const history = state.players[playerColor].history;

  switch (action) {
    case "discarding":
      return {
        ...history,
        discarded: [
          ...history.discarded,
          ...handAct,
          ...meadowAct,
          ...revealAct,
        ],
        cityDiscarded: [...history.cityDiscarded, ...cityAct],
      };
    case "playing":
      return {
        ...history,
        played: [
          ...history.played,
          ...handAct,
          ...discardAct,
          ...meadowAct,
          ...revealAct,
          ...legendsAct,
          ...farmStackAct,
          ...oppositeCityAct,
        ],
      };
    case "giving":
      return {
        ...history,
        gave: [...history.gave, ...handAct, ...meadowAct, ...revealAct],
      };
  }
}

function actOnSelectedCards(
  state: GameState,
  playerId: string | null,
  action: Action,
  toColor: PlayerColor | null,
) {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  const player = state.players[playerColor];
  const oppositePlayer = state.players[oppositePlayerOf(playerColor)];

  const [handKeep, handAct] = partition(player.hand, (card) => !card[action]);
  const [cityKeep, cityAct] = partition(player.city, (card) => !card[action]);
  const [meadowKeep, meadowAct] = partition(
    state.meadow,
    (card) => !card[action],
  );
  const [revealKeep, revealAct] = partition(
    state.reveal,
    (card) => !card[action],
  );
  const [discardKeep, discardAct] = partition(
    state.discard,
    (card) => !card[action],
  );
  const [legendsKeep, legendsAct] = partition(
    state.players[playerColor].legends,
    (card) => !card[action],
  );
  const [farmStackKeep, farmStackAct] = partition(
    state.farmStack,
    (card) => !card[action],
  );
  const [oppositeCityKeep, oppositeCityAct] = partition(
    state.players[oppositePlayerOf(playerColor)].city,
    (card) => !card[action],
  );

  const updatedHistory = updatedHistoryOnAction(
    state,
    playerColor,
    action,
    handAct,
    cityAct,
    meadowAct,
    revealAct,
    discardAct,
    legendsAct,
    farmStackAct,
    oppositeCityAct,
  );

  let newState: GameState = {
    ...state,
    players: {
      ...state.players,
      [playerColor]: {
        ...player,
        hand: handKeep,
        city: cityKeep,
        history: updatedHistory,
        legends: legendsKeep,
      },
      ...(toColor !== null && {
        [toColor]: {
          ...state.players[toColor],
          city: oppositeCityKeep,
        },
      }),
    },
    meadow: meadowKeep,
    reveal: revealKeep,
    discard: discardKeep,
    farmStack: farmStackKeep,
  };

  switch (action) {
    case "discarding":
      const discard = [
        ...state.discard,
        ...handAct,
        ...cityAct,
        ...meadowAct,
        ...revealAct,
      ];

      newState.discard = discard.map((card) => ({
        ...card,
        playing: false,
        discarding: false,
        giving: false,
        below: null,
      }));

      newState = updateCardsBelow(newState, playerColor);
      break;
    case "playing":
      const city = [
        ...player.city,
        ...handAct,
        ...meadowAct,
        ...revealAct,
        ...discardAct,
        ...legendsAct,
        ...farmStackAct,
        ...oppositeCityAct,
      ];
      const [otherPlayedCards, myCity] = partition(
        city,
        (card) => card.name === "Fool" && card.playing,
      );

      // Create new city arrays with proper sorting
      const newMyCity = sortCity(myCity).map((card) => ({
        ...card,
        playing: false,
        discarding: false,
        giving: false,
      }));

      const newOppositeCity = sortCity([
        ...oppositeCityKeep,
        ...otherPlayedCards,
      ]).map((card) => ({
        ...card,
        playing: false,
        discarding: false,
        giving: false,
      }));

      newState.players[playerColor] = {
        ...newState.players[playerColor],
        city: newMyCity,
      };
      newState.players[oppositePlayerOf(playerColor)] = {
        ...newState.players[oppositePlayerOf(playerColor)],
        city: newOppositeCity,
      };
      newState = updateCardsBelow(newState, playerColor);
      break;
    case "giving":
      if (toColor === null) return state;
      const playerTo = state.players[toColor];

      const hand =
        playerColor === toColor
          ? [...player.hand, ...meadowAct, ...revealAct]
          : [...handKeep];
      const playerToHand = [
        ...playerTo.hand,
        ...handAct,
        ...meadowAct,
        ...revealAct,
      ];

      // Create new hand arrays with proper mapping
      const newHand = hand.map((card) => ({
        ...card,
        playing: false,
        discarding: false,
        giving: false,
        below: null,
      }));

      const newPlayerToHand = playerToHand.map((card) => ({
        ...card,
        playing: false,
        discarding: false,
        giving: false,
        below: null,
      }));

      // Update players with new hand arrays
      newState.players[playerColor] = {
        ...newState.players[playerColor],
        hand: newHand,
      };

      if (playerColor !== toColor) {
        newState.players[toColor] = {
          ...newState.players[toColor],
          hand: newPlayerToHand,
        };
      }

      break;
  }

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function discardSelectedCards(
  state: GameState,
  playerId: string | null,
): GameState {
  return actOnSelectedCards(state, playerId, "discarding", null);
}

export function playSelectedCards(
  state: GameState,
  playerId: string | null,
): GameState {
  return actOnSelectedCards(state, playerId, "playing", null);
}

export function giveSelectedCards(
  state: GameState,
  playerId: string | null,
  toColor: PlayerColor,
): GameState {
  return actOnSelectedCards(state, playerId, "giving", toColor);
}

export function addResourcesToCardInCity(
  state: GameState,
  playerId: string | null,
  cityColor: PlayerColor,
  index: number,
  resources: ResourceCount,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  if (index >= state.players[cityColor].city.length) return state;
  const card = state.players[cityColor].city[index];
  if (card.storage === null) return state;

  const updatedStorage: ResourceCount = { ...card.storage };

  for (const key in resources) {
    if (Object.prototype.hasOwnProperty.call(resources, key)) {
      const typedKey = key as keyof ResourceCount;
      updatedStorage[typedKey] += resources[typedKey];
      updatedStorage[typedKey] = Math.max(0, updatedStorage[typedKey]);
    }
  }

  const updatedCard: Card = {
    ...card,
    storage: updatedStorage,
  };

  const updatedCity = state.players[cityColor].city.map((c, i) =>
    i === index ? updatedCard : c,
  );

  const newState: GameState = {
    ...state,
    players: {
      ...state.players,
      [cityColor]: {
        ...state.players[cityColor],
        city: updatedCity,
      },
    },
  };

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function placeCharacterOnLocation(
  state: GameState,
  playerId: string | null,
  index: number,
  charactersVisiting: 1 | -1,
  character: CharacterType,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  if (index >= state.locations.length) return state;
  const location = state.locations[index];

  if (
    !canPlaceCharacterOnLocation(
      state,
      location,
      playerColor,
      charactersVisiting,
      character,
    )
  )
    return state;

  const updatedLocation: Location = {
    ...location,
    ...(location.characters !== null && {
      characters: {
        ...location.characters,
        [character]: location.characters[character] + charactersVisiting,
      },
    }),
  };

  const newState: GameState = {
    ...state,
    locations: state.locations.map((loc, i) =>
      i === index ? updatedLocation : loc,
    ),
  };

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function addResourcesToLocation(
  state: GameState,
  playerId: string | null,
  index: number,
  resources: ResourceCount,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  if (index >= state.locations.length) return state;
  const location = state.locations[index];

  if (!canAddResourcesToLocation(state, location, playerColor)) return state;

  const updatedStorage: ResourceCount = { ...location.storage!! };

  for (const key in resources) {
    if (Object.prototype.hasOwnProperty.call(resources, key)) {
      const typedKey = key as keyof ResourceCount;
      updatedStorage[typedKey] += resources[typedKey];
      updatedStorage[typedKey] = Math.max(0, updatedStorage[typedKey]);
    }
  }

  const updatedLocation: Location = {
    ...location,
    storage: updatedStorage,
  };

  const updatedLocations = state.locations.map((l, i) =>
    i === index ? updatedLocation : l,
  );

  const newState: GameState = {
    ...state,
    locations: updatedLocations,
  };

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function addResourcesToPower(
  state: GameState,
  playerId: string | null,
  resources: ResourceCount,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  const player = state.players[playerColor];
  const power = player.power;
  if (power === null) return state;

  if (!canAddResourcesToPower(state, power, playerColor)) return state;

  const updatedStorage: ResourceCount = { ...power.storage!! };

  for (const key in resources) {
    if (Object.prototype.hasOwnProperty.call(resources, key)) {
      const typedKey = key as keyof ResourceCount;
      updatedStorage[typedKey] += resources[typedKey];
      updatedStorage[typedKey] = Math.max(0, updatedStorage[typedKey]);
    }
  }

  const updatedPower: Power = {
    ...power,
    storage: updatedStorage,
  };

  const updatedPlayer: Player = {
    ...player,
    power: updatedPower,
  };

  const newState: GameState = {
    ...state,
    players: {
      ...state.players,
      [playerColor]: updatedPlayer,
    },
  };

  if (!sanityCheck(newState)) {
    return state;
  }
  return newState;
}

export function nextPower(
  state: GameState,
  playerId: string | null,
  delta: 1 | -1,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  const player = state.players[playerColor];
  const numPowers = powers.length;

  const currentPowerIndex = powers.findIndex(
    (power) => power.name === player.power?.name,
  );
  const newIndex = (currentPowerIndex + delta + numPowers) % numPowers;

  const updatedPlayer: Player = {
    ...player,
    power: powers[newIndex],
  };

  const newState: GameState = {
    ...state,
    players: {
      ...state.players,
      [playerColor]: updatedPlayer,
    },
  };

  if (!sanityCheck(newState)) {
    return state;
  }
  return newState;
}

export function toggleOccupiedCardInCity(
  state: GameState,
  playerId: string | null,
  cityColor: PlayerColor,
  index: number,
  occupied: boolean,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  if (index >= state.players[cityColor].city.length) return state;
  const card = state.players[cityColor].city[index];
  if (card.occupied === null) return state;

  const updatedCard: Card = {
    ...card,
    occupied: occupied,
  };

  const updatedCity = state.players[cityColor].city.map((c, i) =>
    i === index ? updatedCard : c,
  );

  const newState: GameState = {
    ...state,
    players: {
      ...state.players,
      [cityColor]: {
        ...state.players[cityColor],
        city: updatedCity,
      },
    },
  };

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function addResourcesToSelf(
  state: GameState,
  playerId: string | null,
  resources: ResourceCount,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  const player = state.players[playerColor];
  const updatedResources: ResourceCount = { ...player.resources };

  let updatedState = { ...state };

  for (const key in resources) {
    if (Object.prototype.hasOwnProperty.call(resources, key)) {
      const typedKey = key as keyof ResourceCount;

      if (typedKey === "cards") {
        for (let i = 0; i < resources.cards; i++) {
          updatedState = drawCard(updatedState, playerId);
        }
      } else {
        updatedResources[typedKey] += resources[typedKey];
        updatedResources[typedKey] = Math.max(0, updatedResources[typedKey]);
      }
    }
  }

  const newState: GameState = {
    ...updatedState,
    players: {
      ...state.players,
      [playerColor]: {
        ...updatedState.players[playerColor],
        resources: updatedResources,
      },
    },
  };

  if (!sanityCheck(newState)) return state;
  return newState;
}

export function giveResources(
  state: GameState,
  playerId: string | null,
  resources: ResourceCount,
  toColor: PlayerColor,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor !== state.turn) return state;

  const player = state.players[playerColor];
  const playerTo = state.players[toColor];
  if (player === playerTo) return state;

  const updatedResources: ResourceCount = { ...player.resources };
  const updatedToResources: ResourceCount = { ...playerTo.resources };

  for (const key in resources) {
    if (Object.prototype.hasOwnProperty.call(resources, key)) {
      const typedKey = key as keyof ResourceCount;
      const amount = resources[typedKey];

      if (amount <= 0) continue;
      if (player.resources[typedKey] < amount) return state;

      if (typedKey !== "cards") {
        updatedResources[typedKey] -= amount;
        updatedToResources[typedKey] += amount;
      }
    }
  }

  const newState: GameState = {
    ...state,
    players: {
      ...state.players,
      [playerColor]: {
        ...state.players[playerColor],
        resources: updatedResources,
      },
      [toColor]: {
        ...state.players[toColor],
        resources: updatedToResources,
      },
    },
  };

  if (!sanityCheck(newState)) return state;
  return newState;
}
