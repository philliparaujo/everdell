import {
  Card,
  defaultResources,
  GameState,
  Player,
  PlayerColor,
  Resources,
  Season,
} from "./gameTypes";
import {
  getPlayerColor,
  isSafeToEndTurn,
  maxCitySize,
  oppositePlayerOf,
  partition,
} from "./helpers";

export function endTurn(state: GameState, playerId: string | null): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  // Can't end turn if meadow not full
  if (!isSafeToEndTurn(state)) return state;

  return {
    ...state,
    turn: oppositePlayerOf(state.turn),
  };
}

export function setDiscarding(
  state: GameState,
  playerId: string | null,
  discarding: boolean
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;
  if (state.players[playerColor].playing) return state;

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
  playing: boolean
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;
  if (state.players[playerColor].discarding) return state;

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

export function drawCard(state: GameState, playerId: string | null): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  const deck: Card[] = [...state.deck];

  if (deck.length === 0) {
    return state;
  }
  if (state.players[playerColor].hand.length >= 8) {
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
  };

  return {
    ...state,
    deck,
    players,
  };
}

export function toggleCardDiscarding(
  state: GameState,
  playerId: string | null,
  location: "hand" | "city" | "meadow",
  index: number
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
  }

  return newState;
}

export function toggleCardPlaying(
  state: GameState,
  playerId: string | null,
  location: "hand" | "meadow" | "discard",
  index: number
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
  }

  return newState;
}

export function discardSelectedCards(
  state: GameState,
  playerId: string | null
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  const player = state.players[playerColor];

  const [handKeep, handDiscard] = partition(
    player.hand,
    (card) => !card.discarding
  );
  const [cityKeep, cityDiscard] = partition(
    player.city,
    (card) => !card.discarding
  );
  const [meadowKeep, meadowDiscard] = partition(
    state.meadow,
    (card) => !card.discarding
  );

  const discard = [
    ...state.discard,
    ...handDiscard,
    ...cityDiscard,
    ...meadowDiscard,
  ];

  return {
    ...state,
    players: {
      ...state.players,
      [playerColor]: {
        ...player,
        hand: handKeep,
        city: cityKeep,
      },
    },
    discard: discard.map((card) => ({
      ...card,
      discarding: false,
    })),
    meadow: meadowKeep,
  };
}

export function playSelectedCards(
  state: GameState,
  playerId: string | null
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  const player = state.players[playerColor];
  const oppositePlayer = state.players[oppositePlayerOf(playerColor)];

  const [handKeep, handPlay] = partition(player.hand, (card) => !card.playing);
  const [meadowKeep, meadowPlay] = partition(
    state.meadow,
    (card) => !card.playing
  );
  const [discardKeep, discardPlay] = partition(
    state.discard,
    (card) => !card.playing
  );

  const city = [...player.city, ...handPlay, ...meadowPlay, ...discardPlay];
  const [myCity, otherPlayedCards] = partition(
    city,
    (card) => card.name !== "Fool"
  );

  const mySortedCity = myCity
    .sort((a, b) => (a.name < b.name ? -1 : 1))
    .sort((a, b) =>
      a.effectType.toString() < b.effectType.toString() ? -1 : 1
    );

  if (mySortedCity.length > maxCitySize(mySortedCity)) return state;

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
        })),
      },
      [oppositePlayerOf(playerColor)]: {
        ...oppositePlayer,
        city: [...oppositePlayer.city, ...otherPlayedCards].map((card) => ({
          ...card,
          playing: false,
        })),
      },
    },
    meadow: meadowKeep,
    discard: discardKeep,
  };
}

export function addToMeadow(
  state: GameState,
  playerId: string | null
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  const deck: Card[] = [...state.deck];

  if (deck.length === 0) {
    return state;
  }
  if (state.meadow.length >= 8) {
    return state;
  }

  const topCard: Card | undefined = deck.pop();
  if (!topCard) {
    return state;
  }

  return {
    ...state,
    deck,
    meadow: [...state.meadow, topCard],
  };
}

export function visitLocation(
  state: GameState,
  playerId: string | null,
  index: number,
  workersVisiting: 1 | -1
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  if (index >= state.locations.length) return state;

  const location = state.locations[index];
  const player = state.players[playerColor];

  if (workersVisiting >= 0) {
    if (player.workers.workersLeft - workersVisiting < 0) return state;
    if (
      location.exclusive &&
      (location.workers.Red > 0 || location.workers.Blue > 0)
    )
      return state;
  } else {
    if (
      player.workers.workersLeft - workersVisiting >
      player.workers.maxWorkers
    )
      return state;
    if (location.workers[playerColor] <= 0) return state;
  }

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
      i === index ? updatedLocation : loc
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

export function visitEvent(
  state: GameState,
  playerId: string | null,
  index: number,
  workersVisiting: 1 | -1
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  if (index >= state.events.length) return state;

  const event = state.events[index];
  const player = state.players[playerColor];

  if (workersVisiting >= 0) {
    if (player.workers.workersLeft - workersVisiting < 0) return state;
  } else {
    if (
      player.workers.workersLeft - workersVisiting >
      player.workers.maxWorkers
    )
      return state;
    if (event.workers[playerColor] <= 0) return state;
  }

  const updatedEvent = {
    ...event,
    workers: {
      ...event.workers,
      [playerColor]: event.workers[playerColor] + workersVisiting,
    },
  };

  const newState: GameState = {
    ...state,
    events: state.events.map((event, i) =>
      i === index ? updatedEvent : event
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
      coins: event.value,
    });
  }

  return newState;
}

export function visitCardInCity(
  state: GameState,
  playerId: string | null,
  cityColor: PlayerColor,
  index: number,
  workersVisiting: 1 | -1
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  if (index >= state.players[cityColor].city.length) return state;

  const card = state.players[cityColor].city[index];
  const player = state.players[playerColor];

  if (workersVisiting > 0) {
    if (player.workers.workersLeft - workersVisiting < 0) return state;
    if (
      card.maxDestinations === null ||
      card.activeDestinations === null ||
      card.activeDestinations >= card.maxDestinations
    )
      return state;
  } else {
    if (
      player.workers.workersLeft - workersVisiting >
      player.workers.maxWorkers
    )
      return state;
    if (
      card.activeDestinations === null ||
      card.activeDestinations + workersVisiting < 0
    )
      return state;
  }

  const updatedCard: Card = {
    ...card,
    activeDestinations: card.activeDestinations + workersVisiting,
    workers: {
      ...card.workers,
      [playerColor]: card.workers[playerColor] + workersVisiting,
    },
  };
  const updatedCity = state.players[cityColor].city.map((c, i) =>
    i === index ? updatedCard : c
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

export function addResourcesToCardInCity(
  state: GameState,
  playerId: string | null,
  cityColor: PlayerColor,
  index: number,
  resources: Resources
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  if (index >= state.players[cityColor].city.length) return state;

  const card = state.players[cityColor].city[index];
  if (card.storage === null) return state;

  const updatedStorage: Resources = { ...card.storage };

  for (const key in resources) {
    if (Object.prototype.hasOwnProperty.call(resources, key)) {
      const typedKey = key as keyof Resources;
      updatedStorage[typedKey] += resources[typedKey];
      updatedStorage[typedKey] = Math.max(0, updatedStorage[typedKey]);
    }
  }

  const updatedCard: Card = {
    ...card,
    storage: updatedStorage,
  };

  const updatedCity = state.players[cityColor].city.map((c, i) =>
    i === index ? updatedCard : c
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
  occupied: boolean
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
    i === index ? updatedCard : c
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
  resources: Resources
): GameState {
  const playerColor = getPlayerColor(state, playerId);
  if (playerColor === null) return state;
  if (playerColor !== state.turn) return state;

  const player = state.players[playerColor];
  const updatedResources: Resources = { ...player.resources };

  let updatedState = { ...state };

  for (const key in resources) {
    if (Object.prototype.hasOwnProperty.call(resources, key)) {
      const typedKey = key as keyof Resources;

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
