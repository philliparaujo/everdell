import React, { createContext, useContext, useEffect, useState } from "react";
import {
  DEFAULT_ACTIVE_EXPANSIONS,
  DEFAULT_POWERS_ENABLED,
} from "../assets/data/cards";
import { generateDefaultCardFrequencies, isAllDefault } from "../utils/card";
import {
  clearActiveExpansions,
  clearCardFrequencies,
  getActiveExpansions,
  getCardFrequencies,
  getPowersEnabled,
  storeActiveExpansions,
  storeCardFrequencies,
  storePowersEnabled,
} from "../utils/identity";
import { ExpansionName } from "./gameTypes";

interface CardManagementContextType {
  cardFrequencies: Record<ExpansionName, Record<string, number>>;
  activeExpansions: ExpansionName[];
  powersEnabled: boolean;
  updateCardFrequency: (
    cardName: string,
    expansionName: ExpansionName,
    frequency: number,
  ) => void;
  toggleExpansion: (expansion: ExpansionName) => void;
  togglePowersEnabled: () => void;
  resetToDefaults: () => void;
  isModified: boolean;
}

const CardManagementContext = createContext<
  CardManagementContextType | undefined
>(undefined);

export const CardManagementProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cardFrequencies, setCardFrequencies] = useState(() => {
    const savedFrequencies = getCardFrequencies();
    return (
      savedFrequencies ||
      generateDefaultCardFrequencies(DEFAULT_ACTIVE_EXPANSIONS)
    );
  });

  const [activeExpansions, setActiveExpansions] = useState(() => {
    const savedExpansions = getActiveExpansions();
    return savedExpansions || DEFAULT_ACTIVE_EXPANSIONS;
  });

  const [powersEnabled, setPowersEnabled] = useState(() => {
    const savedPowersEnabled = getPowersEnabled();
    return savedPowersEnabled || DEFAULT_POWERS_ENABLED;
  });

  const [isModified, setIsModified] = useState(false);

  // Save to local storage whenever frequencies change
  useEffect(() => {
    storeCardFrequencies(cardFrequencies);
    setIsModified(!isAllDefault(cardFrequencies));
  }, [cardFrequencies]);

  useEffect(() => {
    storeActiveExpansions(activeExpansions);
  }, [activeExpansions]);

  useEffect(() => {
    storePowersEnabled(powersEnabled);
  }, [powersEnabled]);

  const updateCardFrequency = (
    cardName: string,
    expansionName: ExpansionName,
    frequency: number,
  ) => {
    setCardFrequencies((prev) => {
      const updatedFrequencies = {
        ...prev,
        [expansionName]: {
          ...prev[expansionName],
          [cardName]: Math.max(0, frequency),
        },
      };

      // Check if all cards in this expansion now have frequency 0
      const allCardsZero = Object.values(
        updatedFrequencies[expansionName],
      ).every((freq) => freq === 0);

      // Update active expansions based on the new state
      setActiveExpansions((prev) => {
        const isCurrentlyActive = prev.includes(expansionName);
        const shouldBeActive = frequency > 0 || !allCardsZero;

        if (shouldBeActive && !isCurrentlyActive) {
          return [...prev, expansionName];
        } else if (!shouldBeActive && isCurrentlyActive) {
          return prev.filter((e) => e !== expansionName);
        }
        return prev;
      });

      return updatedFrequencies;
    });
  };

  const toggleExpansion = (expansion: ExpansionName) => {
    setActiveExpansions((prev) =>
      prev.includes(expansion)
        ? prev.filter((e) => e !== expansion)
        : [...prev, expansion],
    );
  };

  const togglePowersEnabled = () => {
    setPowersEnabled((prev) => !prev);
  };

  const resetToDefaults = () => {
    const defaultFrequencies = generateDefaultCardFrequencies(
      DEFAULT_ACTIVE_EXPANSIONS,
    );
    setCardFrequencies(defaultFrequencies);
    setActiveExpansions(DEFAULT_ACTIVE_EXPANSIONS);
    setPowersEnabled(DEFAULT_POWERS_ENABLED);
    clearCardFrequencies();
    clearActiveExpansions();
  };

  return (
    <CardManagementContext.Provider
      value={{
        cardFrequencies,
        activeExpansions,
        powersEnabled,
        updateCardFrequency,
        toggleExpansion,
        togglePowersEnabled,
        resetToDefaults,
        isModified,
      }}
    >
      {children}
    </CardManagementContext.Provider>
  );
};

export const useCardManagement = () => {
  const context = useContext(CardManagementContext);
  if (!context) {
    throw new Error(
      "useCardManagement must be used within a CardManagementProvider",
    );
  }
  return context;
};
