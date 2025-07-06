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
    below: null,
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
    // Skip legends cards
    if (card.expansionName === "legends") return [];

    const count = flatCardFrequencies[card.name] ?? 1;
    return Array.from({ length: count }, () => ({
      ...card,
      discarding: false,
      playing: false,
      giving: false,
      below: null,
    }));
  });

  return shuffleArray(cards);
};

export const makeLegendsDecks = (
  cardFrequencies: Record<string, number>,
): { critters: Card[]; constructions: Card[] } => {
  const legends = rawCards.filter((card) => card.expansionName === "legends");
  const critters = legends
    .filter((card) => card.cardType === "Critter")
    .flatMap((card) => {
      const count = cardFrequencies[card.name] ?? 1;
      return Array.from({ length: count }, () => ({
        ...card,
        discarding: false,
        playing: false,
        giving: false,
        below: null,
      }));
    });
  const constructions = legends
    .filter((card) => card.cardType === "Construction")
    .flatMap((card) => {
      const count = cardFrequencies[card.name] ?? 1;
      return Array.from({ length: count }, () => ({
        ...card,
        discarding: false,
        playing: false,
        giving: false,
        below: null,
      }));
    });
  return {
    critters: shuffleArray(critters),
    constructions: shuffleArray(constructions),
  };
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

// TODO: Remove assumption of no duplicate top cards
export const groupCardsByBelow = (
  indexedCards: { card: Card; index: number }[],
): { card: Card; index: number }[][] => {
  // Create a map to group cards by their below property
  const groups = new Map<string, { card: Card; index: number }[]>();

  // First pass: group all cards by their below property
  indexedCards.forEach(({ card, index }) => {
    if (card.below) {
      if (!groups.has(card.below)) {
        groups.set(card.below, []);
      }
      groups.get(card.below)!.push({ card, index });
    }
  });

  // Second pass: find the top card for each group and add it to the beginning
  const result: { card: Card; index: number }[][] = [];

  groups.forEach((group, belowName) => {
    // Find the top card (the card whose name matches the belowName)
    const topCardIndex = indexedCards.findIndex(
      ({ card }) => card.name === belowName,
    );

    if (topCardIndex !== -1) {
      // Top card exists, add it to the beginning of the group
      const topCard = indexedCards[topCardIndex];
      result.push([topCard, ...group]);
    } else {
      // No top card found, just use the group as is
      result.push(group);
    }
  });

  // Third pass: add cards that don't have a below property as individual groups
  indexedCards.forEach(({ card, index }) => {
    if (!card.below) {
      // Check if this card is not already included as a top card in any group
      const isTopCard = groups.has(card.name);
      if (!isTopCard) {
        result.push([{ card, index }]);
      }
    }
  });

  return result;
};
