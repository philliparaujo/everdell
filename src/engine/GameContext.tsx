import { doc, getFirestore, onSnapshot, setDoc } from 'firebase/firestore';
import { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { cardFrequencies, rawCards } from '../assets/data/cards';
import { events } from '../assets/data/events';
import { locations } from '../assets/data/locations';
import * as Actions from "./gameActions";
import { Card, defaultPlayer, GameState, PlayerColor, Resources } from './gameTypes';
import { shuffleArray } from './helpers';

let actionQueue = Promise.resolve();

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
  endTurn: (playerId: string | null) => void;
  setDiscarding: (playerId: string | null, discarding: Boolean) => void;
  setPlaying: (playerId: string | null, playing: Boolean) => void;
  toggleCardDiscarding: (playerId: string | null, location: "hand" | "city" | "meadow", index: number) => void;
  toggleCardPlaying: (playerId: string | null, location: "hand" | "meadow" | "discard", index: number) => void;
  discardSelectedCards: (playerId: string | null) => void;
  playSelectedCards: (playerId: string | null) => void;
  drawCard: (playerId: string | null) => void;
  addToMeadow: (playerId: string | null) => void;
  visitLocation: (playerId: string | null, index: number, workersVisiting: 1 | -1) => void;
  visitEvent: (playerId: string | null, index: number, workersVisiting: 1 | -1) => void;
  visitCardInCity: (playerId: string | null, cityColor: PlayerColor, index: number, workersVisiting: 1 | -1) => void;
  toggleOccupiedCardInCity: (playerId: string | null, cityColor: PlayerColor, index: number, occupied: Boolean) => void;
  addResourcesToCardInCity: (playerId: string | null, cityColor: PlayerColor, index: number, resources: Resources) => void;
  addResourcesToSelf: (playerId: string | null, resources: Resources) => void;
  harvest: (playerId: string | null) => void;
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
  addResourcesToSelf: noop,
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
    return (...args: Tail<Parameters<T>>) => {
      // Chain this action onto the queue
      actionQueue = actionQueue.then(async () => {
        setLocalGame((prev) => {
          const updated = fn(prev, ...args);
          // Update Firestore without awaiting inside setState
          void setDoc(dbRef, updated);
          return updated;
        });
      }).catch((err) => {
        console.error("Action failed:", err);
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
    addResourcesToSelf: wrapAction(Actions.addResourcesToSelf),
    harvest: wrapAction(Actions.harvest),
  };

  return <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>;
};

export const useGame = () => useContext(GameContext);