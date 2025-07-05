import { DEFAULT_CARD_FREQUENCIES, rawCards } from "../assets/data/cards";
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
  cardFrequencies: Record<ExpansionName, Record<string, number>>,
): Card[] => {
  // Extract all card frequencies into a flat structure
  const flatCardFrequencies = Object.values(cardFrequencies).reduce(
    (acc, expansionCards) => ({ ...acc, ...expansionCards }),
    {} as Record<string, number>,
  );

  const cards = rawCards.flatMap((card) => {
    const count = flatCardFrequencies[card.name] ?? 1;
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
  cards: [ExpansionName, Record<string, number>][],
): Record<ExpansionName, { card: Card; frequency: number }[]> => {
  return cards.reduce(
    (acc, [expansionName, cardFrequencies]) => {
      acc[expansionName] = Object.entries(cardFrequencies)
        .map(([cardName, frequency]) => {
          const card = findCard(cardName);
          return card ? { card, frequency } : null;
        })
        .filter(
          (item): item is { card: Card; frequency: number } => item !== null,
        );

      return acc;
    },
    {} as Record<string, { card: Card; frequency: number }[]>,
  );
};

export const getBannedCards = (
  cardFrequencies: Record<ExpansionName, Record<string, number>>,
): [ExpansionName, Record<string, number>][] => {
  return Object.entries(cardFrequencies).map(
    ([expansionName, cardFrequencies]) => [
      expansionName as ExpansionName,
      Object.fromEntries(
        Object.entries(cardFrequencies).filter(
          ([_, frequency]) => frequency === 0,
        ),
      ),
    ],
  );
};

export const getActiveCards = (
  cardFrequencies: Record<ExpansionName, Record<string, number>>,
): [ExpansionName, Record<string, number>][] => {
  return Object.entries(cardFrequencies).map(
    ([expansionName, cardFrequencies]) => [
      expansionName as ExpansionName,
      Object.fromEntries(
        Object.entries(cardFrequencies).filter(
          ([_, frequency]) => frequency > 0,
        ),
      ),
    ],
  );
};

export const isAllDefault = (
  cardFrequencies: Record<ExpansionName, Record<string, number>>,
): boolean => {
  return Object.entries(cardFrequencies).every(
    ([expansionName, frequencies]) => {
      return (
        Object.entries(frequencies).every(
          ([cardName, frequency]) =>
            frequency ===
            DEFAULT_CARD_FREQUENCIES[expansionName as ExpansionName]?.[
              cardName
            ],
        ) ||
        Object.entries(frequencies).every(
          ([cardName, frequency]) => frequency === 0,
        )
      );
    },
  );
};
