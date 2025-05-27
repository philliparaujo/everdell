import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Card, defaultPlayer, GameState, PlayerColor, Resources } from './gameTypes';
import * as Actions from "./gameActions"
import { cardFrequencies, rawCards } from '../assets/data/cards';
import { locations } from '../assets/data/locations';

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
    turn: firstPlayer,
  };
}
const defaultState = setupGame(cards, "Red");

const GameContext = createContext<{
  game: GameState;
  endTurn: () => void;
  setDiscarding: (playerColor: PlayerColor, discarding: Boolean) => void;
  setPlaying: (playerColor: PlayerColor, playing: Boolean) => void;
  toggleCardDiscarding: (playerColor: PlayerColor, location: "hand" | "city" | "meadow", index: number) => void;
  toggleCardPlaying: (playerColor: PlayerColor, location: "hand" | "meadow", index: number) => void;
  discardSelectedCards: (playerColor: PlayerColor) => void;
  playSelectedCards: (playerColor: PlayerColor) => void;
  drawCard: (playerColor: PlayerColor) => void;
  addToMeadow: () => void;
  visitLocation: (playerColor: PlayerColor, index: number, workersVisiting: 1 | -1) => void;
  visitCardInCity: (playerColor: PlayerColor, cityColor: PlayerColor, index: number, workersVisiting: 1 | -1) => void;
  toggleOccupiedCardInCity: (cityColor: PlayerColor, index: number, occupied: Boolean) => void;
  addResourcesToCardInCity: (cityColor: PlayerColor, index: number, resources: Resources) => void;
  addResourcesToPlayer: (playerColor: PlayerColor, resources: Resources) => void;
  harvest: (playerColor: PlayerColor) => void;
}>({
  game: defaultState,
  endTurn: () => { },
  setDiscarding: (playerColor, discarding) => { },
  setPlaying: (playerColor, playing) => { },
  toggleCardDiscarding: (playerColor, location, index) => { },
  toggleCardPlaying: (playerColor, location, index) => { },
  discardSelectedCards: (playerColor) => { },
  playSelectedCards: (playerColor) => { },
  drawCard: (playerColor) => { },
  addToMeadow: () => { },
  visitLocation: (playerColor, index) => { },
  visitCardInCity: (playerColor, cityColor, index, workersVisiting) => { },
  toggleOccupiedCardInCity: (cityColor, index, occupied) => { },
  addResourcesToCardInCity: (cityColor, index, resoruces) => { },
  addResourcesToPlayer: (playerColor, resources) => { },
  harvest: (playerColor) => { },
});

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, setGame] = useState<GameState>(defaultState);

  const endTurn = () => setGame((prev) => Actions.endTurn(prev));
  const setDiscarding = (playerColor: PlayerColor, discarding: Boolean) => setGame((prev) => Actions.setDiscarding(prev, playerColor, discarding));
  const setPlaying = (playerColor: PlayerColor, playing: Boolean) => setGame((prev) => Actions.setPlaying(prev, playerColor, playing));
  const toggleCardDiscarding = (playerColor: PlayerColor, location: "hand" | "city" | "meadow", index: number) => setGame((prev) => Actions.toggleCardDiscarding(prev, playerColor, location, index));
  const toggleCardPlaying = (playerColor: PlayerColor, location: "hand" | "meadow", index: number) => setGame((prev) => Actions.toggleCardPlaying(prev, playerColor, location, index));
  const discardSelectedCards = (playerColor: PlayerColor) => setGame((prev) => Actions.discardSelectedCards(prev, playerColor));
  const playSelectedCards = (playerColor: PlayerColor) => setGame((prev) => Actions.playSelectedCards(prev, playerColor));
  const drawCard = (playerColor: PlayerColor) => setGame((prev) => Actions.drawCard(prev, playerColor))
  const addToMeadow = () => setGame((prev) => Actions.addToMeadow(prev));
  const visitLocation = (playerColor: PlayerColor, index: number, workersVisiting: 1 | -1) => setGame((prev) => Actions.visitLocation(prev, playerColor, index, workersVisiting));
  const visitCardInCity = (playerColor: PlayerColor, cityColor: PlayerColor, index: number, workersVisiting: 1 | -1) => setGame((prev) => Actions.visitCardInCity(prev, playerColor, cityColor, index, workersVisiting));
  const toggleOccupiedCardInCity = (cityColor: PlayerColor, index: number, occupied: Boolean) => setGame((prev) => Actions.toggleOccupiedCardInCity(prev, cityColor, index, occupied));
  const addResourcesToCardInCity = (cityColor: PlayerColor, index: number, resources: Resources) => setGame((prev) => Actions.addResourcesToCardInCity(prev, cityColor, index, resources));
  const addResourcesToPlayer = (playerColor: PlayerColor, resources: Resources) => setGame((prev) => Actions.addResourcesToPlayer(prev, playerColor, resources));
  const harvest = (playerColor: PlayerColor) => setGame((prev) => Actions.harvest(prev, playerColor));

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