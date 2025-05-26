import { Card, GameState, Player, PlayerColor, Resources } from "./gameTypes";

export function endTurn(state: GameState): GameState {
  return {
    ...state,
    turn: state.turn === "Red" ? "Blue" : "Red",
  };
}

export function setDiscarding(
  state: GameState,
  playerColor: PlayerColor,
  discarding: Boolean
): GameState {
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
  playerColor: PlayerColor,
  playing: Boolean
): GameState {
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

export function drawCard(
  state: GameState,
  playerColor: PlayerColor
): GameState {
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
  playerColor: PlayerColor,
  location: "hand" | "city" | "meadow",
  index: number
): GameState {
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
  playerColor: PlayerColor,
  location: "hand" | "meadow",
  index: number
): GameState {
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
  }

  return newState;
}

export function discardSelectedCards(
  state: GameState,
  playerColor: PlayerColor
): GameState {
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
  playerColor: PlayerColor
): GameState {
  const player = state.players[playerColor];

  const [handKeep, handPlay] = partition(player.hand, (card) => !card.playing);
  const [meadowKeep, meadowPlay] = partition(
    state.meadow,
    (card) => !card.playing
  );

  const city = [...player.city, ...handPlay, ...meadowPlay];

  return {
    ...state,
    players: {
      ...state.players,
      [playerColor]: {
        ...player,
        hand: handKeep,
        city: city.map((card) => ({
          ...card,
          playing: false,
        })),
      },
    },
    meadow: meadowKeep,
  };
}

function partition<T>(arr: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const keep: T[] = [];
  const discard: T[] = [];
  for (const item of arr) {
    (predicate(item) ? keep : discard).push(item);
  }
  return [keep, discard];
}

export function addToMeadow(state: GameState): GameState {
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
  playerColor: PlayerColor,
  index: number,
  workersVisiting: 1 | -1
): GameState {
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
    return addResourcesToPlayer(newState, playerColor, location.resources);
  }

  return newState;
}

export function visitCardinCity(
  state: GameState,
  playerColor: PlayerColor,
  cityColor: PlayerColor,
  index: number,
  workersVisiting: 1 | -1
): GameState {
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
    city: updatedCity,
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

export function addResourcesToPlayer(
  state: GameState,
  playerColor: PlayerColor,
  resources: Resources
): GameState {
  const player = state.players[playerColor];
  const updatedResources: Resources = { ...player.resources };

  let updatedState = { ...state };

  for (const key in resources) {
    if (Object.prototype.hasOwnProperty.call(resources, key)) {
      const typedKey = key as keyof Resources;

      if (typedKey === "cards") {
        for (let i = 0; i < resources.cards; i++) {
          updatedState = drawCard(updatedState, playerColor);
        }
      } else {
        updatedResources[typedKey] += resources[typedKey];
      }
    }
  }

  for (const key in updatedResources) {
    if (Object.prototype.hasOwnProperty.call(updatedResources, key)) {
      const typedKey = key as keyof Resources;
      updatedResources[typedKey] = Math.max(0, updatedResources[typedKey]);
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
