import {
  canVisitCardInCity,
  canVisitEvent,
  canVisitJourney,
  canVisitLocation,
  canVisitSpecialEvent,
  computeMaxCitySize,
  isSafeToEndTurn,
  oppositePlayerOf,
} from "../utils/gameLogic";
import { getPlayerColor } from "../utils/identity";
import { partition } from "../utils/math";
import {
  MAX_HAND_SIZE,
  MAX_MEADOW_SIZE,
  MAX_REVEAL_SIZE,
} from "./gameConstants";
import { defaultResources } from "./gameDefaults";
import {
  Card,
  GameState,
  Player,
  PlayerColor,
  ResourceCount,
  Season,
} from "./gameTypes";

export function endTurn(state: GameState, playerId: string | null): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  if (!isSafeToEndTurn(state)) return state;

  return {
    ...state,
    turn: oppositePlayerOf(state.turn),
    players: {
      ...state.players,
      [oppositePlayerOf(state.turn)]: {
        ...state.players[oppositePlayerOf(state.turn)],
        history: {
          discarded: [],
          cityDiscarded: [],
          drew: [],
          played: [],
          gave: [],
          resources: state.players[oppositePlayerOf(state.turn)].resources,
          workers: state.players[oppositePlayerOf(state.turn)].workers,
          season: state.players[oppositePlayerOf(state.turn)].season,
        },
      },
    },
  };
}

export function visitLocation(
  state: GameState,
  playerId: string | null,
  index: number,
  workersVisiting: 1 | -1,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
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

  const newState: GameState = {
    ...state,
    locations: state.locations.map((loc, i) =>
      i === index ? updatedLocation : loc,
    ),
    players: {
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
    },
  };

  if (workersVisiting > 0) {
    return addResourcesToSelf(newState, playerId, location.resources);
  }

  return newState;
}

export function visitJourney(
  state: GameState,
  playerId: string | null,
  index: number,
  workersVisiting: 1 | -1,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
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

  const newState: GameState = {
    ...state,
    journeys: state.journeys.map((journey, i) =>
      i === index ? updatedJourney : journey,
    ),
    players: {
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
    },
  };

  if (workersVisiting > 0) {
    return addResourcesToSelf(newState, playerId, {
      ...defaultResources,
      coins: journey.value,
    });
  }

  return newState;
}

export function visitEvent(
  state: GameState,
  playerId: string | null,
  index: number,
  workersVisiting: 1 | -1,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
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

  const newState: GameState = {
    ...state,
    events: state.events.map((event, i) =>
      i === index ? updatedEvent : event,
    ),
    players: {
      ...state.players,
      [playerColor]: {
        ...player,
        workers: {
          ...player.workers,
          workersLeft: player.workers.workersLeft - workersVisiting,
        },
      },
    },
  };

  if (workersVisiting > 0) {
    return addResourcesToSelf(newState, playerId, {
      ...defaultResources,
      coins: event.value,
    });
  }

  return newState;
}

export function visitSpecialEvent(
  state: GameState,
  playerId: string | null,
  index: number,
  workersVisiting: 1 | -1,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
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

  const newState: GameState = {
    ...state,
    specialEvents: state.specialEvents.map((specialEvent, i) =>
      i === index ? updatedSpecialEvent : specialEvent,
    ),
    players: {
      ...state.players,
      [playerColor]: {
        ...player,
        workers: {
          ...player.workers,
          workersLeft: player.workers.workersLeft - workersVisiting,
        },
      },
    },
  };

  if (workersVisiting > 0 && specialEvent.value) {
    return addResourcesToSelf(newState, playerId, {
      ...defaultResources,
      coins: specialEvent.value,
    });
  }

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
  if (playerColor === null) return state;
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

  return newState;
}

export function setDiscarding(
  state: GameState,
  playerId: string | null,
  discarding: boolean,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;
  if (state.players[playerColor].playing || state.players[playerColor].giving)
    return state;

  const players = { ...state.players };
  players[playerColor] = {
    ...players[playerColor],
    discarding: discarding,
  };

  return {
    ...state,
    players,
  };
}

export function setPlaying(
  state: GameState,
  playerId: string | null,
  playing: boolean,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;
  if (
    state.players[playerColor].discarding ||
    state.players[playerColor].giving
  )
    return state;

  const players = { ...state.players };
  players[playerColor] = {
    ...players[playerColor],
    playing: playing,
  };

  return {
    ...state,
    players,
  };
}

export function setGiving(
  state: GameState,
  playerId: string | null,
  giving: boolean,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;
  if (
    state.players[playerColor].discarding ||
    state.players[playerColor].playing
  )
    return state;
  if (state.players[playerColor].giving === giving) return state;

  const players = { ...state.players };
  players[playerColor] = {
    ...players[playerColor],
    giving: giving,
  };

  return {
    ...state,
    players,
  };
}

export function revealCard(
  state: GameState,
  playerId: string | null,
  location: "deck" | "discard",
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null || playerColor !== state.turn) return state;

  const reveal: Card[] = [...state.reveal];
  if (reveal.length >= MAX_REVEAL_SIZE) return state;

  if (location === "deck") {
    if (state.deck.length === 0) return state;

    const deck = [...state.deck];
    const topCard = deck.pop();
    if (!topCard) return state;

    return {
      ...state,
      deck,
      reveal: [...reveal, topCard],
    };
  }

  if (location === "discard") {
    if (state.discard.length === 0) return state;

    const discard = [...state.discard];
    const index = Math.floor(Math.random() * discard.length);
    const [chosen] = discard.splice(index, 1);

    return {
      ...state,
      discard,
      reveal: [...reveal, chosen],
    };
  }

  return state;
}

export function harvest(state: GameState, playerId: string | null): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  const player = state.players[playerColor];
  const { season } = player;

  let newSeason: Season = season;
  let additionalWorkers = 0;

  if (season === "Winter") {
    newSeason = "Spring";
    additionalWorkers = 1;
  } else if (season === "Spring") {
    newSeason = "Summer";
    additionalWorkers = 1;
  } else if (season === "Summer") {
    newSeason = "Autumn";
    additionalWorkers = 2;
  } else {
    return state;
  }

  const updatedPlayer: Player = {
    ...player,
    season: newSeason,
    workers: {
      maxWorkers: player.workers.maxWorkers + additionalWorkers,
      workersLeft: player.workers.workersLeft + additionalWorkers,
    },
  };

  return {
    ...state,
    players: {
      ...state.players,
      [playerColor]: updatedPlayer,
    },
  };
}

export function toggleCardDiscarding(
  state: GameState,
  playerId: string | null,
  location: "hand" | "city" | "meadow" | "reveal",
  index: number,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  const newState: GameState = {
    ...state,
    players: {
      ...state.players,
      [playerColor]: {
        ...state.players[playerColor],
        hand: [...state.players[playerColor].hand],
        city: [...state.players[playerColor].city],
      },
    },
    meadow: [...state.meadow],
    reveal: [...state.reveal],
  };

  let cardToToggle: Card | undefined;

  if (location === "hand") {
    cardToToggle = newState.players[playerColor].hand[index];
    if (cardToToggle) {
      newState.players[playerColor].hand[index] = {
        ...cardToToggle,
        discarding: !cardToToggle.discarding,
      };
    }
  } else if (location === "city") {
    cardToToggle = newState.players[playerColor].city[index];
    if (cardToToggle) {
      newState.players[playerColor].city[index] = {
        ...cardToToggle,
        discarding: !cardToToggle.discarding,
      };
    }
  } else if (location === "meadow") {
    cardToToggle = newState.meadow[index];
    if (cardToToggle) {
      newState.meadow[index] = {
        ...cardToToggle,
        discarding: !cardToToggle.discarding,
      };
    }
  } else if (location === "reveal") {
    cardToToggle = newState.reveal[index];
    if (cardToToggle) {
      newState.reveal[index] = {
        ...cardToToggle,
        discarding: !cardToToggle.discarding,
      };
    }
  }

  return newState;
}

export function toggleCardPlaying(
  state: GameState,
  playerId: string | null,
  location: "hand" | "meadow" | "discard" | "reveal",
  index: number,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  const newState: GameState = {
    ...state,
    players: {
      ...state.players,
      [playerColor]: {
        ...state.players[playerColor],
        hand: [...state.players[playerColor].hand],
        city: [...state.players[playerColor].city],
      },
    },
    meadow: [...state.meadow],
    discard: [...state.discard],
    reveal: [...state.reveal],
  };

  let cardToToggle: Card | undefined;

  if (location === "hand") {
    cardToToggle = newState.players[playerColor].hand[index];
    if (cardToToggle) {
      newState.players[playerColor].hand[index] = {
        ...cardToToggle,
        playing: !cardToToggle.playing,
      };
    }
  } else if (location === "meadow") {
    cardToToggle = newState.meadow[index];
    if (cardToToggle) {
      newState.meadow[index] = {
        ...cardToToggle,
        playing: !cardToToggle.playing,
      };
    }
  } else if (location === "discard") {
    cardToToggle = newState.discard[index];
    if (cardToToggle) {
      newState.discard[index] = {
        ...cardToToggle,
        playing: !cardToToggle.playing,
      };
    }
  } else if (location === "reveal") {
    cardToToggle = newState.reveal[index];
    if (cardToToggle) {
      newState.reveal[index] = {
        ...cardToToggle,
        playing: !cardToToggle.playing,
      };
    }
  }

  return newState;
}

export function toggleCardGiving(
  state: GameState,
  playerId: string | null,
  location: "hand" | "meadow" | "reveal",
  index: number,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  const newState: GameState = {
    ...state,
    players: {
      ...state.players,
      [playerColor]: {
        ...state.players[playerColor],
        hand: [...state.players[playerColor].hand],
        city: [...state.players[playerColor].city],
      },
    },
    meadow: [...state.meadow],
    discard: [...state.discard],
    reveal: [...state.reveal],
  };

  let cardToToggle: Card | undefined;

  if (location === "hand") {
    cardToToggle = newState.players[playerColor].hand[index];
    if (cardToToggle) {
      newState.players[playerColor].hand[index] = {
        ...cardToToggle,
        giving: !cardToToggle.giving,
      };
    }
  } else if (location === "meadow") {
    cardToToggle = newState.meadow[index];
    if (cardToToggle) {
      newState.meadow[index] = {
        ...cardToToggle,
        giving: !cardToToggle.giving,
      };
    }
  } else if (location === "reveal") {
    cardToToggle = newState.reveal[index];
    if (cardToToggle) {
      newState.reveal[index] = {
        ...cardToToggle,
        giving: !cardToToggle.giving,
      };
    }
  }

  return newState;
}

export function discardSelectedCards(
  state: GameState,
  playerId: string | null,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  const player = state.players[playerColor];

  const [handKeep, handDiscard] = partition(
    player.hand,
    (card) => !card.discarding,
  );
  const [cityKeep, cityDiscard] = partition(
    player.city,
    (card) => !card.discarding,
  );
  const [meadowKeep, meadowDiscard] = partition(
    state.meadow,
    (card) => !card.discarding,
  );
  const [revealKeep, revealDiscard] = partition(
    state.reveal,
    (card) => !card.discarding,
  );

  const discard = [
    ...state.discard,
    ...handDiscard,
    ...cityDiscard,
    ...meadowDiscard,
    ...revealDiscard,
  ];

  return {
    ...state,
    players: {
      ...state.players,
      [playerColor]: {
        ...player,
        hand: handKeep,
        city: cityKeep,
        history: {
          ...state.players[playerColor].history,
          discarded: [
            ...state.players[playerColor].history.discarded,
            ...handDiscard,
            ...meadowDiscard,
            ...revealDiscard,
          ],
          cityDiscarded: [
            ...state.players[playerColor].history.cityDiscarded,
            ...cityDiscard,
          ],
        },
      },
    },
    discard: discard.map((card) => ({
      ...card,
      playing: false,
      discarding: false,
      giving: false,
    })),
    meadow: meadowKeep,
    reveal: revealKeep,
  };
}

export function playSelectedCards(
  state: GameState,
  playerId: string | null,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  const player = state.players[playerColor];
  const oppositePlayer = state.players[oppositePlayerOf(playerColor)];

  const [handKeep, handPlay] = partition(player.hand, (card) => !card.playing);
  const [meadowKeep, meadowPlay] = partition(
    state.meadow,
    (card) => !card.playing,
  );
  const [discardKeep, discardPlay] = partition(
    state.discard,
    (card) => !card.playing,
  );
  const [revealKeep, revealPlay] = partition(
    state.reveal,
    (card) => !card.playing,
  );

  const city = [
    ...player.city,
    ...handPlay,
    ...meadowPlay,
    ...discardPlay,
    ...revealPlay,
  ];
  const [otherPlayedCards, myCity] = partition(
    city,
    (card) => card.name === "Fool" && card.playing,
  );

  const oppositeCity = [...oppositePlayer.city, ...otherPlayedCards];

  if (myCity.length > computeMaxCitySize(myCity)) return state;
  if (oppositeCity.length > computeMaxCitySize(oppositeCity)) return state;

  const mySortedCity = myCity
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .sort((a, b) =>
      a.effectType.toString() < b.effectType.toString() ? -1 : 1,
    );

  return {
    ...state,
    players: {
      ...state.players,
      [playerColor]: {
        ...player,
        hand: handKeep,
        city: mySortedCity.map((card) => ({
          ...card,
          playing: false,
          discarding: false,
          giving: false,
        })),
        history: {
          ...state.players[playerColor].history,
          played: [
            ...state.players[playerColor].history.played,
            ...handPlay,
            ...meadowPlay,
            ...discardPlay,
            ...revealPlay,
          ],
        },
      },
      [oppositePlayerOf(playerColor)]: {
        ...oppositePlayer,
        city: oppositeCity.map((card) => ({
          ...card,
          playing: false,
          discarding: false,
          giving: false,
        })),
      },
    },
    meadow: meadowKeep,
    discard: discardKeep,
    reveal: revealKeep,
  };
}

export function giveSelectedCards(
  state: GameState,
  playerId: string | null,
  toColor: PlayerColor,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  const player = state.players[playerColor];
  const playerTo = state.players[toColor];

  const [handKeep, handGive] = partition(player.hand, (card) => !card.giving);
  const [meadowKeep, meadowGive] = partition(
    state.meadow,
    (card) => !card.giving,
  );
  const [revealKeep, revealGive] = partition(
    state.reveal,
    (card) => !card.giving,
  );

  const updatePlayerHand: Card[] =
    playerColor === toColor
      ? [...player.hand, ...meadowGive, ...revealGive]
      : [...handKeep];
  const playerToHand = [
    ...playerTo.hand,
    ...handGive,
    ...meadowGive,
    ...revealGive,
  ];

  if (updatePlayerHand.length > MAX_HAND_SIZE) return state;
  if (playerColor !== toColor && playerToHand.length > MAX_HAND_SIZE)
    return state;

  return {
    ...state,
    players: {
      ...state.players,
      [playerColor]: {
        ...player,
        hand: updatePlayerHand.map((card) => ({
          ...card,
          playing: false,
          discarding: false,
          giving: false,
        })),
        history: {
          ...state.players[playerColor].history,
          gave: [
            ...state.players[playerColor].history.gave,
            ...handGive,
            ...meadowGive,
            ...revealGive,
          ],
        },
      },
      ...(playerColor !== toColor && {
        [toColor]: {
          ...playerTo,
          hand: playerToHand.map((card) => ({
            ...card,
            playing: false,
            discarding: false,
            giving: false,
          })),
        },
      }),
    },
    meadow: meadowKeep,
    reveal: revealKeep,
  };
}

export function drawCard(state: GameState, playerId: string | null): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  const deck: Card[] = [...state.deck];

  if (deck.length === 0) {
    return state;
  }
  if (state.players[playerColor].hand.length >= MAX_HAND_SIZE) {
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

  return {
    ...state,
    deck,
    players,
  };
}

export function refillMeadow(
  state: GameState,
  playerId: string | null,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
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

  return {
    ...state,
    deck,
    meadow: [...state.meadow, ...topCards],
  };
}

export function addResourcesToCardInCity(
  state: GameState,
  playerId: string | null,
  cityColor: PlayerColor,
  index: number,
  resources: ResourceCount,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
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

  return {
    ...state,
    players: {
      ...state.players,
      [cityColor]: {
        ...state.players[cityColor],
        city: updatedCity,
      },
    },
  };
}

export function toggleOccupiedCardInCity(
  state: GameState,
  playerId: string | null,
  cityColor: PlayerColor,
  index: number,
  occupied: boolean,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
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

  return {
    ...state,
    players: {
      ...state.players,
      [cityColor]: {
        ...state.players[cityColor],
        city: updatedCity,
      },
    },
  };
}

export function addResourcesToSelf(
  state: GameState,
  playerId: string | null,
  resources: ResourceCount,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
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

  return {
    ...updatedState,
    players: {
      ...state.players,
      [playerColor]: {
        ...updatedState.players[playerColor],
        resources: updatedResources,
      },
    },
  };
}

export function giveResources(
  state: GameState,
  playerId: string | null,
  resources: ResourceCount,
  toColor: PlayerColor,
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
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

  return {
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
}
