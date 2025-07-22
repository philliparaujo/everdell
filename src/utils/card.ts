import { BASE_CARD_FREQUENCIES, rawCards } from "../assets/data/cards";
import { defaultCharacterCount } from "../engine/gameDefaults";
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
    characters: null,
  };
};

export const makeShuffledDeck = (
  cardFrequencies: Record<ExpansionName, Record<string, number>>,
  powersEnabled: boolean,
): Card[] => {
  // Extract all card frequencies into a flat structure
  const flatCardFrequencies = Object.values(cardFrequencies).reduce(
    (acc, expansionCards) => ({ ...acc, ...expansionCards }),
    {} as Record<string, number>,
  );

  const cards: Card[] = rawCards.flatMap((card) => {
    // Skip legends cards
    if (card.expansionName === "legends") return [];

    const count = flatCardFrequencies[card.name] ?? 1;
    return Array.from({ length: count }, () => ({
      ...card,
      discarding: false,
      playing: false,
      giving: false,
      below: null,
      characters: powersEnabled ? defaultCharacterCount : null,
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

// Function to generate default card frequencies based on active expansions
export function generateDefaultCardFrequencies(
  activeExpansions: ExpansionName[],
): Record<ExpansionName, Record<string, number>> {
  const result = {} as Record<ExpansionName, Record<string, number>>;

  // Get all expansion names from the base frequencies
  const allExpansions = Object.keys(BASE_CARD_FREQUENCIES) as ExpansionName[];

  allExpansions.forEach((expansion) => {
    if (activeExpansions.includes(expansion)) {
      // If expansion is active, use the base frequencies
      result[expansion] = { ...BASE_CARD_FREQUENCIES[expansion] };
    } else {
      // If expansion is not active, set all frequencies to 0
      const zeroFrequencies: Record<string, number> = {};
      Object.keys(BASE_CARD_FREQUENCIES[expansion]).forEach((cardName) => {
        zeroFrequencies[cardName] = 0;
      });
      result[expansion] = zeroFrequencies;
    }
  });

  return result;
}

export const isAllDefault = (
  cardFrequencies: Record<ExpansionName, Record<string, number>>,
): boolean => {
  return Object.entries(cardFrequencies).every(
    ([expansionName, frequencies]) => {
      return (
        Object.entries(frequencies).every(
          ([cardName, frequency]) =>
            frequency ===
            BASE_CARD_FREQUENCIES[expansionName as ExpansionName]?.[cardName],
        ) ||
        Object.entries(frequencies).every(
          ([cardName, frequency]) => frequency === 0,
        )
      );
    },
  );
};

/**
 * Groups cards into stacks based on their `below` property.
 * Special-case: all "Scurrble Champion" cards stack together.
 */
export const groupCardsByBelow = (
  indexedCards: { card: Card; index: number }[],
): { card: Card; index: number }[][] => {
  const result: { card: Card; index: number }[][] = [];
  const processedIndices = new Set<number>();

  // === Special case: stack all Scurrble Champions together ===
  const championStack = indexedCards.filter(
    ({ card }) => card.name === "Scurrble Champion",
  );
  if (championStack.length > 0) {
    result.push(championStack);
    championStack.forEach(({ index }) => processedIndices.add(index));
  }

  // === Group by below property for remaining cards ===
  const groups = new Map<string, { card: Card; index: number }[]>();
  indexedCards.forEach(({ card, index }) => {
    if (!processedIndices.has(index) && card.below) {
      if (!groups.has(card.below)) {
        groups.set(card.below, []);
      }
      groups.get(card.below)!.push({ card, index });
    }
  });

  groups.forEach((belowCards, belowName) => {
    // Find top cards matching the belowName
    const topCards = indexedCards.filter(
      ({ card, index }) =>
        card.name === belowName && !processedIndices.has(index),
    );

    if (topCards.length > 0) {
      // Evenly distribute belowCards among topCards
      const perTop = Math.ceil(belowCards.length / topCards.length);
      topCards.forEach((topCardData, idx) => {
        const start = idx * perTop;
        const end = Math.min(start + perTop, belowCards.length);
        const slice = belowCards.slice(start, end);
        if (slice.length > 0) {
          result.push([topCardData, ...slice]);
          // Mark processed
          processedIndices.add(topCardData.index);
          slice.forEach(({ index }) => processedIndices.add(index));
        }
      });
    } else {
      // No top cards found, group as-is
      result.push(belowCards);
      belowCards.forEach(({ index }) => processedIndices.add(index));
    }
  });

  // === Remaining cards as individual stacks ===
  indexedCards.forEach((data) => {
    if (!processedIndices.has(data.index)) {
      result.push([data]);
      processedIndices.add(data.index);
    }
  });

  return result;
};
