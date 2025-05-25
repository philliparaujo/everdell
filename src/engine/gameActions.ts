import { Card, GameState, PlayerColor, Resources } from "./gameTypes";

export function endTurn(state: GameState): GameState {
  return {
    ...state,
    turn: state.turn === "Red" ? "Blue" : "Red",
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

export function discardCard(
  state: GameState,
  playerColor: PlayerColor,
  cardName: string
): GameState {
  const hand = [...state.players[playerColor].hand];
  const discard = [...state.discard];

  const index = hand.findIndex((card) => card.name === cardName);

  if (index === -1) {
    return state;
  }

  const [removedCard] = hand.splice(index, 1);
  discard.push(removedCard);

  return {
    ...state,
    players: {
      ...state.players,
      [playerColor]: {
        ...state.players[playerColor],
        hand: hand,
      },
    },
    discard,
  };
}

export function addToMeadow(state: GameState): GameState {
  const deck: Card[] = [...state.deck];

  if (deck.length === 0) {
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
  index: number
): GameState {
  const location = state.locations[index];
  const player = state.players[playerColor];

  if (player.workers.workersLeft <= 0) return state;
  if (index >= state.locations.length) return state;
  if (
    location.exclusive &&
    (location.workers.Red > 0 || location.workers.Blue > 0)
  )
    return state;

  const newState: GameState = {
    ...state,
    locations: state.locations.map((loc, i) =>
      i === index
        ? {
            ...loc,
            workers: {
              ...loc.workers,
              [playerColor]: loc.workers[playerColor] + 1,
            },
          }
        : loc
    ),
    players: {
      ...state.players,
      [playerColor]: {
        ...player,
        workers: {
          ...player.workers,
          workersLeft: player.workers.workersLeft - 1,
        },
        resources: {
          ...player.resources,
        },
      },
    },
  };

  return addResourcesToPlayer(newState, playerColor, location.resources);
}

function addResourcesToPlayer(
  state: GameState,
  playerColor: PlayerColor,
  resources: Resources
): GameState {
  const newState = { ...state };
  const playerResources = newState.players[playerColor].resources;

  for (const key in resources) {
    if (resources.hasOwnProperty(key)) {
      const typedKey = key as keyof Resources;
      playerResources[typedKey] += resources[typedKey];
    }
  }

  return newState;
}
