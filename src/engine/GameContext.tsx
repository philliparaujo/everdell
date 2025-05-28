import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Card, defaultPlayer, GameState, PlayerColor, Resources } from './gameTypes';
import * as Actions from "./gameActions"
import { cardFrequencies, rawCards } from '../assets/data/cards';
import { locations } from '../assets/data/locations';
import { events } from '../assets/data/events';

const cards: Card[] = rawCards.flatMap((card) => {
  const count = cardFrequencies[card.name] ?? 1;
  return Array.from({ length: count }, () => ({
    ...card,
    discarding: false,
    playing: false
  }));
});


const shuffleArray = (array: any[]) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export function setupGame(cards: Card[], firstPlayer: PlayerColor): GameState {
  const deck = shuffleArray(cards);

  const meadow = deck.slice(0, 8);  // 8 cards
  const firstHand = deck.slice(8, 13);  // 5 cards
  const secondHand = deck.slice(13, 19);  // 6 cards
  const remainingDeck = deck.slice(19);

  return {
    players: {
      Red: {
        ...defaultPlayer,
        color: 'Red',
        hand: firstPlayer === 'Red' ? firstHand : secondHand,
      },
      Blue: {
        ...defaultPlayer,
        color: 'Blue',
        hand: firstPlayer === 'Blue' ? firstHand : secondHand,
      },
    },
    deck: remainingDeck,
    discard: [],
    meadow: meadow,
    locations: locations,
    events: events,
    turn: firstPlayer,
  };
}
const defaultState = setupGame(cards, "Red");

const noop = (..._: any[]) => { };

const GameContext = createContext<{
  game: GameState;
  endTurn: () => void;
  setDiscarding: (playerColor: PlayerColor, discarding: Boolean) => void;
  setPlaying: (playerColor: PlayerColor, playing: Boolean) => void;
  toggleCardDiscarding: (playerColor: PlayerColor, location: "hand" | "city" | "meadow", index: number) => void;
  toggleCardPlaying: (playerColor: PlayerColor, location: "hand" | "meadow" | "discard", index: number) => void;
  discardSelectedCards: (playerColor: PlayerColor) => void;
  playSelectedCards: (playerColor: PlayerColor) => void;
  drawCard: (playerColor: PlayerColor) => void;
  addToMeadow: () => void;
  visitLocation: (playerColor: PlayerColor, index: number, workersVisiting: 1 | -1) => void;
  visitEvent: (playerColor: PlayerColor, index: number, workersVisiting: 1 | -1) => void;
  visitCardInCity: (playerColor: PlayerColor, cityColor: PlayerColor, index: number, workersVisiting: 1 | -1) => void;
  toggleOccupiedCardInCity: (cityColor: PlayerColor, index: number, occupied: Boolean) => void;
  addResourcesToCardInCity: (cityColor: PlayerColor, index: number, resources: Resources) => void;
  addResourcesToPlayer: (playerColor: PlayerColor, resources: Resources) => void;
  harvest: (playerColor: PlayerColor) => void;
}>({
  game: defaultState,
  endTurn: noop,
  setDiscarding: noop,
  setPlaying: noop,
  toggleCardDiscarding: noop,
  toggleCardPlaying: noop,
  discardSelectedCards: noop,
  playSelectedCards: noop,
  drawCard: noop,
  addToMeadow: noop,
  visitLocation: noop,
  visitEvent: noop,
  visitCardInCity: noop,
  toggleOccupiedCardInCity: noop,
  addResourcesToCardInCity: noop,
  addResourcesToPlayer: noop,
  harvest: noop,
});

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, setGame] = useState<GameState>(defaultState);

  function wrapAction<T extends (...args: any[]) => GameState>(
    fn: T
  ): (...args: Tail<Parameters<T>>) => void {
    return (...args: Tail<Parameters<T>>) =>
      setGame((prev) => fn(prev, ...args));
  }

  type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never;

  const endTurn = wrapAction(Actions.endTurn);
  const setDiscarding = wrapAction(Actions.setDiscarding);
  const setPlaying = wrapAction(Actions.setPlaying);
  const toggleCardDiscarding = wrapAction(Actions.toggleCardDiscarding);
  const toggleCardPlaying = wrapAction(Actions.toggleCardPlaying);
  const discardSelectedCards = wrapAction(Actions.discardSelectedCards);
  const playSelectedCards = wrapAction(Actions.playSelectedCards);
  const drawCard = wrapAction(Actions.drawCard);
  const addToMeadow = wrapAction(Actions.addToMeadow);
  const visitLocation = wrapAction(Actions.visitLocation);
  const visitEvent = wrapAction(Actions.visitEvent);
  const visitCardInCity = wrapAction(Actions.visitCardInCity);
  const toggleOccupiedCardInCity = wrapAction(Actions.toggleOccupiedCardInCity);
  const addResourcesToCardInCity = wrapAction(Actions.addResourcesToCardInCity);
  const addResourcesToPlayer = wrapAction(Actions.addResourcesToPlayer);
  const harvest = wrapAction(Actions.harvest);

  return (
    <GameContext.Provider value={{
      game,
      endTurn,
      setDiscarding,
      setPlaying,
      toggleCardDiscarding,
      toggleCardPlaying,
      discardSelectedCards,
      playSelectedCards,
      drawCard,
      addToMeadow,
      visitLocation,
      visitEvent,
      visitCardInCity,
      toggleOccupiedCardInCity,
      addResourcesToCardInCity,
      addResourcesToPlayer,
      harvest
    }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);