import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { cardFrequencies, rawCards } from "../assets/data/cards";
import { events } from "../assets/data/events";
import { locations } from "../assets/data/locations";
import * as Actions from "./gameActions";
import {
  Card,
  defaultPlayer,
  Event,
  GameState,
  Location,
  PlayerColor,
  Resources,
  SpecialEvent,
} from "./gameTypes";
import { pickFourSpecialEvents, shuffleArray } from "./helpers";
import { journeys } from "../assets/data/journey";
import { specialEvents } from "../assets/data/specialEvents";
import {
  FIRST_PLAYER_HAND_SIZE,
  MAX_MEADOW_SIZE,
  SECOND_PLAYER_HAND_SIZE,
} from "./gameConstants";

let actionQueue = Promise.resolve();

export function setupGame(firstPlayer: PlayerColor): GameState {
  // Shuffle deck
  const cards: Card[] = rawCards.flatMap((card) => {
    const count = cardFrequencies[card.name] ?? 1;
    return Array.from({ length: count }, () => ({
      ...card,
      discarding: false,
      playing: false,
      giving: false,
    }));
  });
  const deck = shuffleArray(cards);

  // Fill up meadow and deal cards
  const MEADOW_END = MAX_MEADOW_SIZE;
  const FIRST_END = MEADOW_END + FIRST_PLAYER_HAND_SIZE;
  const SECOND_END = FIRST_END + SECOND_PLAYER_HAND_SIZE;

  const meadow = deck.slice(0, MEADOW_END);
  const firstHand = deck.slice(MEADOW_END, FIRST_END);
  const secondHand = deck.slice(FIRST_END, SECOND_END);
  const remainingDeck = deck.slice(SECOND_END);

  // Set up remaining objects
  const newLocations: Location[] = locations.map((location) => ({
    ...location,
    workers: { Red: 0, Blue: 0 },
  }));
  const newEvents: Event[] = events.map((event) => ({
    ...event,
    used: false,
    workers: { Red: 0, Blue: 0 },
  }));
  const newSpecialEvents: SpecialEvent[] = pickFourSpecialEvents(
    specialEvents.map((se) => ({
      ...se,
      used: false,
      workers: { Red: 0, Blue: 0 },
    })),
  );

  return {
    players: {
      Red: {
        ...defaultPlayer,
        color: "Red",
        hand: firstPlayer === "Red" ? firstHand : secondHand,
      },
      Blue: {
        ...defaultPlayer,
        color: "Blue",
        hand: firstPlayer === "Blue" ? firstHand : secondHand,
      },
    },
    deck: remainingDeck,
    discard: [],
    meadow: meadow,
    reveal: [],
    locations: newLocations,
    journeys: journeys,
    events: newEvents,
    specialEvents: newSpecialEvents,
    turn: firstPlayer,
  };
}
const defaultState = setupGame("Red");

const noop = (..._: any[]) => {};

const GameContext = createContext<{
  game: GameState;
  endTurn: (playerId: string | null) => void;
  setDiscarding: (playerId: string | null, discarding: boolean) => void;
  setPlaying: (playerId: string | null, playing: boolean) => void;
  setGiving: (playerId: string | null, giving: boolean) => void;
  toggleCardDiscarding: (
    playerId: string | null,
    location: "hand" | "city" | "meadow" | "reveal",
    index: number,
  ) => void;
  toggleCardPlaying: (
    playerId: string | null,
    location: "hand" | "meadow" | "discard" | "reveal",
    index: number,
  ) => void;
  toggleCardGiving: (
    playerId: string | null,
    location: "hand" | "meadow" | "reveal",
    index: number,
  ) => void;
  discardSelectedCards: (playerId: string | null) => void;
  playSelectedCards: (playerId: string | null) => void;
  giveSelectedCards: (playerId: string | null, toColor: PlayerColor) => void;
  drawCard: (playerId: string | null) => void;
  revealCard: (playerId: string | null, location: "deck" | "discard") => void;
  refillMeadow: (playerId: string | null) => void;
  visitLocation: (
    playerId: string | null,
    index: number,
    workersVisiting: 1 | -1,
  ) => void;
  visitJourney: (
    playerId: string | null,
    index: number,
    workersVisiting: 1 | -1,
  ) => void;
  visitEvent: (
    playerId: string | null,
    index: number,
    workersVisiting: 1 | -1,
  ) => void;
  visitSpecialEvent: (
    playerId: string | null,
    index: number,
    workersVisiting: 1 | -1,
  ) => void;
  visitCardInCity: (
    playerId: string | null,
    cityColor: PlayerColor,
    index: number,
    workersVisiting: 1 | -1,
  ) => void;
  toggleOccupiedCardInCity: (
    playerId: string | null,
    cityColor: PlayerColor,
    index: number,
    occupied: boolean,
  ) => void;
  addResourcesToCardInCity: (
    playerId: string | null,
    cityColor: PlayerColor,
    index: number,
    resources: Resources,
  ) => void;
  addResourcesToSelf: (playerId: string | null, resources: Resources) => void;
  giveResources: (
    playerId: string | null,
    resources: Resources,
    toColor: PlayerColor,
  ) => void;
  harvest: (playerId: string | null) => void;
}>({
  game: defaultState,
  endTurn: noop,
  setDiscarding: noop,
  setPlaying: noop,
  setGiving: noop,
  toggleCardDiscarding: noop,
  toggleCardPlaying: noop,
  toggleCardGiving: noop,
  discardSelectedCards: noop,
  playSelectedCards: noop,
  giveSelectedCards: noop,
  drawCard: noop,
  revealCard: noop,
  refillMeadow: noop,
  visitLocation: noop,
  visitJourney: noop,
  visitEvent: noop,
  visitSpecialEvent: noop,
  visitCardInCity: noop,
  toggleOccupiedCardInCity: noop,
  addResourcesToCardInCity: noop,
  addResourcesToSelf: noop,
  giveResources: noop,
  harvest: noop,
});

export const GameProviderLoader = ({
  children,
}: {
  children: React.ReactNode;
}) => {
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

  return (
    <GameProvider game={game} gameId={gameId}>
      {children}
    </GameProvider>
  );
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

  function wrapAction<T extends (...args: any[]) => GameState>(
    fn: T,
    update: boolean = true,
  ) {
    return (...args: Tail<Parameters<T>>) => {
      // Chain this action onto the queue
      actionQueue = actionQueue
        .then(async () => {
          setLocalGame((prev) => {
            const updated = fn(prev, ...args);
            if (update) {
              void setDoc(dbRef, updated);
            }
            return updated;
          });
        })
        .catch((err) => {
          console.error("Action failed:", err);
        });
    };
  }

  type Tail<T extends any[]> = T extends [any, ...infer R] ? R : never;

  const contextValue = {
    game: localGame,
    endTurn: wrapAction(Actions.endTurn),

    // 3 main actions (visit, play, harvest)
    visitLocation: wrapAction(Actions.visitLocation),
    visitJourney: wrapAction(Actions.visitJourney),
    visitEvent: wrapAction(Actions.visitEvent),
    visitSpecialEvent: wrapAction(Actions.visitSpecialEvent),
    visitCardInCity: wrapAction(Actions.visitCardInCity),

    setDiscarding: wrapAction(Actions.setDiscarding),
    setPlaying: wrapAction(Actions.setPlaying),
    setGiving: wrapAction(Actions.setGiving),
    revealCard: wrapAction(Actions.revealCard),

    harvest: wrapAction(Actions.harvest),

    // Minor, infrequent actions
    refillMeadow: wrapAction(Actions.refillMeadow, true),
    toggleOccupiedCardInCity: wrapAction(
      Actions.toggleOccupiedCardInCity,
      true,
    ),
    giveResources: wrapAction(Actions.giveResources, true),
    addResourcesToCardInCity: wrapAction(
      Actions.addResourcesToCardInCity,
      true,
    ),

    // Minor, frequent actions
    toggleCardDiscarding: wrapAction(Actions.toggleCardDiscarding, false),
    toggleCardPlaying: wrapAction(Actions.toggleCardPlaying, false),
    toggleCardGiving: wrapAction(Actions.toggleCardGiving, false),
    discardSelectedCards: wrapAction(Actions.discardSelectedCards, false),
    playSelectedCards: wrapAction(Actions.playSelectedCards, false),
    giveSelectedCards: wrapAction(Actions.giveSelectedCards, false),
    drawCard: wrapAction(Actions.drawCard, false),
    addResourcesToSelf: wrapAction(Actions.addResourcesToSelf, false),
  };

  return (
    <GameContext.Provider value={contextValue}>{children}</GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);
