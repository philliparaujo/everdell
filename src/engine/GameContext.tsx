import React, { createContext, ReactNode, useContext, useState } from 'react';
import { Card, defaultPlayer, GameState, PlayerColor } from './gameTypes';
import * as Actions from "./gameActions"
import { cardImages } from './images';
import { rawCards } from '../assets/data/cards';
import { locations } from '../assets/data/locations';

const cards: Card[] = rawCards.map((card) => ({
  ...card,
  imagePath: cardImages[card.imageKey] || ''
}));

const defaultState: GameState = {
  players: {
    Red: defaultPlayer,
    Blue: defaultPlayer
  },
  deck: cards,
  discard: [],
  meadow: [],
  locations: locations,
  turn: "Red"
}

const GameContext = createContext<{
  game: GameState;
  endTurn: () => void;
  drawCard: (playerColor: PlayerColor) => void;
  addToMeadow: () => void;
  visitLocation: (playerColor: PlayerColor, index: number) => void;
}>({
  game: defaultState,
  endTurn: () => { },
  drawCard: (playerColor: PlayerColor) => { },
  addToMeadow: () => { },
  visitLocation: (playerColor, index) => { },
});

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [game, setGame] = useState<GameState>(defaultState);

  const endTurn = () => setGame((prev) => Actions.endTurn(prev));
  const drawCard = (playerColor: PlayerColor) => setGame((prev) => Actions.drawCard(prev, playerColor))
  const addToMeadow = () => setGame((prev) => Actions.addToMeadow(prev));
  const visitLocation = (playerColor: PlayerColor, index: number) => setGame((prev) => Actions.visitLocation(prev, playerColor, index));

  return (
    <GameContext.Provider value={{ game, endTurn, drawCard, addToMeadow, visitLocation }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => useContext(GameContext);