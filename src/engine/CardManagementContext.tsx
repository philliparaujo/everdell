import React, { createContext, useContext, useEffect, useState } from "react";
import { DEFAULT_CARD_FREQUENCIES } from "../assets/data/cards";
import {
  clearCardFrequencies,
  getCardFrequencies,
  storeCardFrequencies,
} from "../utils/identity";

interface CardManagementContextType {
  cardFrequencies: Record<string, number>;
  updateCardFrequency: (cardName: string, frequency: number) => void;
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
  const [cardFrequencies, setCardFrequencies] = useState<
    Record<string, number>
  >(DEFAULT_CARD_FREQUENCIES);
  const [isModified, setIsModified] = useState(false);

  // Load saved frequencies from local storage on mount
  useEffect(() => {
    const saved = getCardFrequencies();
    if (saved) {
      try {
        setCardFrequencies(saved);
        setIsModified(true);
      } catch (error) {
        console.error("Failed to load saved card frequencies:", error);
      }
    }
  }, []);

  // Save to local storage whenever frequencies change
  useEffect(() => {
    storeCardFrequencies(cardFrequencies);
  }, [cardFrequencies]);

  const updateCardFrequency = (cardName: string, frequency: number) => {
    setCardFrequencies((prev) => ({
      ...prev,
      [cardName]: Math.max(0, frequency),
    }));
    setIsModified(true);
  };

  const resetToDefaults = () => {
    setCardFrequencies(DEFAULT_CARD_FREQUENCIES);
    setIsModified(false);
    clearCardFrequencies();
  };

  return (
    <CardManagementContext.Provider
      value={{
        cardFrequencies,
        updateCardFrequency,
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
