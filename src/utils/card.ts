import { rawCards } from "../assets/data/cards";
import { Card, ExpansionName } from "../engine/gameTypes";
import { shuffleArray } from "./math";

export const getCardPath = (
  expansionName: ExpansionName,
  cardName: string,
): string => {
  // Remove spaces and force lowercase
  const modifiedCardName = cardName.replace(/ /g, "").toLowerCase();

  return `assets/cards/${expansionName}/${modifiedCardName}.jpg`;
};

export const cardNameFromPath = (path: string): string => {
  return (
    path
      .split("/")
      .pop()
      ?.replace(/\.jpg$/, "") ?? ""
  );
};

export const findCard = (cardName: string): Card | undefined => {
  let card = rawCards.find((card) => card.name === cardName);
  if (!card) {
    return undefined;
  }

  return {
    ...card,
    discarding: false,
    playing: false,
    giving: false,
  };
};

export const makeShuffledDeck = (
  cardFrequencies: Record<string, number>,
): Card[] => {
  const cards = rawCards.flatMap((card) => {
    const count = cardFrequencies[card.name] ?? 1;
    return Array.from({ length: count }, () => ({
      ...card,
      discarding: false,
      playing: false,
      giving: false,
    }));
  });

  return shuffleArray(cards);
};

export const formatExpansionName = (expansionName: string): string => {
  return expansionName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const groupCardsByExpansion = (
  cards: [string, number][],
): Record<string, { card: Card; frequency: number }[]> => {
  return cards.reduce(
    (acc, [cardName, frequency]) => {
      const card = findCard(cardName);
      if (!card) return acc;

      const expansion = card.expansionName;
      if (!acc[expansion]) {
        acc[expansion] = [];
      }
      acc[expansion].push({ card, frequency });
      return acc;
    },
    {} as Record<string, { card: Card; frequency: number }[]>,
  );
};
