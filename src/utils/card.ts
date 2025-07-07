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

  const result: { card: Card; index: number }[][] = [];

  // Second pass: handle each group, creating separate groups for duplicate top cards
  groups.forEach((belowCards, belowName) => {
    // Find all top cards (cards whose name matches the belowName)
    const topCards = indexedCards.filter(({ card }) => card.name === belowName);

    if (topCards.length > 0) {
      // Distribute below cards among top cards
      const belowCardsPerTop = Math.ceil(belowCards.length / topCards.length);

      topCards.forEach((topCard, topIndex) => {
        const startIndex = topIndex * belowCardsPerTop;
        const endIndex = Math.min(
          startIndex + belowCardsPerTop,
          belowCards.length,
        );
        const groupBelowCards = belowCards.slice(startIndex, endIndex);

        if (groupBelowCards.length > 0) {
          result.push([topCard, ...groupBelowCards]);
        } else {
          // No below cards for this top card, add it as individual group
          result.push([topCard]);
        }
      });
    } else {
      // No top card found, just use the group as is
      result.push(belowCards);
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
