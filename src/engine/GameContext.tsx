import { doc, getFirestore, onSnapshot, setDoc } from "firebase/firestore";
import { createContext, useContext, useEffect, useState } from "react";
import * as Actions from "./gameActions";
import {
  Card,
  CharacterType,
  GameState,
  PlayerColor,
  ResourceCount,
} from "./gameTypes";

let actionQueue = Promise.resolve();

interface GameContextType {
  game: GameState;
  endTurn: (playerId: string | null) => void;
  resetTurn: (playerId: string | null) => void;
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
    location: "hand" | "meadow" | "discard" | "reveal" | "legends" | "city",
    index: number,
    fromCityColor: PlayerColor | null,
  ) => void;
  playToOppositeCity: (playerId: string | null, index: number) => void;
  playCard: (
    playerId: string | null,
    location: "hand" | "meadow" | "discard" | "reveal" | "legends",
    index: number,
  ) => void;
  toggleCardGiving: (
    playerId: string | null,
    location: "hand" | "meadow" | "reveal",
    index: number,
  ) => void;
  moveCardBelowInCity: (
    playerId: string | null,
    index: number,
    below: Card | null,
  ) => void;
  discardSelectedCards: (playerId: string | null) => void;
  playSelectedCards: (playerId: string | null) => void;
  giveSelectedCards: (playerId: string | null, toColor: PlayerColor) => void;
  swapHands: (playerId: string | null, toColor: PlayerColor) => void;
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
  achieveEvent: (playerId: string | null, index: number) => void;
  visitSpecialEvent: (
    playerId: string | null,
    index: number,
    workersVisiting: 1 | -1,
  ) => void;
  achieveSpecialEvent: (playerId: string | null, index: number) => void;
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
    resources: ResourceCount,
  ) => void;
  placeCharacterOnLocation: (
    playerId: string | null,
    index: number,
    charactersVisiting: 1 | -1,
    character: CharacterType,
  ) => void;
  nextPower: (playerId: string | null, delta: 1 | -1) => void;
  addResourcesToLocation: (
    playerId: string | null,
    index: number,
    resources: ResourceCount,
  ) => void;
  addResourcesToSelf: (
    playerId: string | null,
    resources: ResourceCount,
  ) => void;
  giveResources: (
    playerId: string | null,
    resources: ResourceCount,
    toColor: PlayerColor,
  ) => void;
  harvest: (playerId: string | null) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

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
    resetTurn: wrapAction(Actions.resetTurn),

    // 3 main actions (visit, play, harvest)
    visitLocation: wrapAction(Actions.visitLocation),
    visitJourney: wrapAction(Actions.visitJourney),
    visitEvent: wrapAction(Actions.visitEvent),
    achieveEvent: wrapAction(Actions.achieveEvent),
    visitSpecialEvent: wrapAction(Actions.visitSpecialEvent),
    achieveSpecialEvent: wrapAction(Actions.achieveSpecialEvent),
    visitCardInCity: wrapAction(Actions.visitCardInCity),

    setDiscarding: wrapAction(Actions.setDiscarding),
    setPlaying: wrapAction(Actions.setPlaying),
    setGiving: wrapAction(Actions.setGiving),
    playCard: wrapAction(Actions.playCard),
    playToOppositeCity: wrapAction(Actions.playToOppositeCity),
    revealCard: wrapAction(Actions.revealCard),
    swapHands: wrapAction(Actions.swapHands),

    harvest: wrapAction(Actions.harvest),

    // Minor, infrequent actions
    refillMeadow: wrapAction(Actions.refillMeadow, true),
    toggleOccupiedCardInCity: wrapAction(
      Actions.toggleOccupiedCardInCity,
      true,
    ),
    moveCardBelowInCity: wrapAction(Actions.moveCardBelowInCity, true),
    giveResources: wrapAction(Actions.giveResources, true),
    addResourcesToCardInCity: wrapAction(
      Actions.addResourcesToCardInCity,
      true,
    ),
    placeCharacterOnLocation: wrapAction(
      Actions.placeCharacterOnLocation,
      true,
    ),
    nextPower: wrapAction(Actions.nextPower, true),
    addResourcesToLocation: wrapAction(Actions.addResourcesToLocation, true),

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

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
