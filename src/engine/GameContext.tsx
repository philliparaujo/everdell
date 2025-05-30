import { doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cardFrequencies, rawCards } from '../assets/data/cards';
import { events } from '../assets/data/events';
import { locations } from '../assets/data/locations';
import * as Actions from "./gameActions";
import { Card, defaultPlayer, GameState, PlayerColor, Resources } from './gameTypes';

const shuffleArray = (array: any[]) => {
  const newArray = [...array]
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

export function setupGame(firstPlayer: PlayerColor): GameState {
  const cards: Card[] = rawCards.flatMap((card) => {
    const count = cardFrequencies[card.name] ?? 1;
    return Array.from({ length: count }, () => ({
      ...card,
      discarding: false,
      playing: false
    }));
  });
  const deck = shuffleArray(cards);

  const meadow = deck.slice(0, 8);  // 8 cards
  const firstHand = deck.slice(8, 13);  // 5 cards
  const secondHand = deck.slice(13, 19);  // 6 cards
  const remainingDeck = deck.slice(19);

  console.log("DECK SIZE IS ", remainingDeck.length);

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
const defaultState = setupGame("Red");

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

export const GameProviderLoader = ({ children }: { children: React.ReactNode }) => {
  const { gameId } = useParams();
  const [game, setGame] = useState<GameState | null>(null);

  useEffect(() => {
    if (!gameId) return;
    const dbRef = doc(getFirestore(), `games/${gameId}`);
    const unsubscribe = onSnapshot(dbRef, (snapshot) => {
      const data = snapshot.data();
      if (data) setGame(data as GameState);
    });
    return () => unsubscribe();
  }, [gameId]);

  if (!game || !gameId) return <div>Loading game...</div>;

  return <GameProvider game={game} gameId={gameId}>{children}</GameProvider>;
};

export const GameProvider = ({
  children,
  game,
  gameId,
}: {
  children: React.ReactNode;
  game: GameState;
  gameId: string;
}) => {
  const [localGame, setLocalGame] = useState(game);
  const dbRef = doc(getFirestore(), `games/${gameId}`);

  useEffect(() => {
    const unsubscribe = onSnapshot(dbRef, (snapshot) => {
      const data = snapshot.data();
      if (data) setLocalGame(data as GameState);
    });
    return () => unsubscribe();
  }, [gameId]);

  function wrapAction<T extends (...args: any[]) => GameState>(fn: T) {
    return async (...args: Tail<Parameters<T>>) => {
      setLocalGame((prev) => {
        const updated = fn(prev, ...args);
        setDoc(dbRef, updated); // Don't await inside setState
        return updated;
      });
    };
  }


  type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never;

  const contextValue = {
    game: localGame,
    endTurn: wrapAction(Actions.endTurn),
    setDiscarding: wrapAction(Actions.setDiscarding),
    setPlaying: wrapAction(Actions.setPlaying),
    toggleCardDiscarding: wrapAction(Actions.toggleCardDiscarding),
    toggleCardPlaying: wrapAction(Actions.toggleCardPlaying),
    discardSelectedCards: wrapAction(Actions.discardSelectedCards),
    playSelectedCards: wrapAction(Actions.playSelectedCards),
    drawCard: wrapAction(Actions.drawCard),
    addToMeadow: wrapAction(Actions.addToMeadow),
    visitLocation: wrapAction(Actions.visitLocation),
    visitEvent: wrapAction(Actions.visitEvent),
    visitCardInCity: wrapAction(Actions.visitCardInCity),
    toggleOccupiedCardInCity: wrapAction(Actions.toggleOccupiedCardInCity),
    addResourcesToCardInCity: wrapAction(Actions.addResourcesToCardInCity),
    addResourcesToPlayer: wrapAction(Actions.addResourcesToPlayer),
    harvest: wrapAction(Actions.harvest),
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

export const useGame = () => useContext(GameContext);