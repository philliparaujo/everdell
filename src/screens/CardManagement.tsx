import React, { useState } from "react";
import { DEFAULT_CARD_FREQUENCIES, rawCards } from "../assets/data/cards";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Navigation from "../components/Navigation";
import { useCardManagement } from "../engine/CardManagementContext";
import { Card } from "../engine/gameTypes";
import {
  findCard,
  formatExpansionName,
  getCardPath,
  groupCardsByExpansion,
} from "../utils/card";
import { HOME_PATH } from "../utils/navigation";

const ActiveCard = ({
  card,
  frequency,
  updateCardFrequency,
  setPreviewedCard,
}: {
  card: Card;
  frequency: number;
  updateCardFrequency: (cardName: string, frequency: number) => void;
  setPreviewedCard: (card: Card) => void;
}) => {
  const cardName = card.name;

  const handleFrequencyChange = (newFrequency: number) => {
    updateCardFrequency(cardName, newFrequency);
    setPreviewedCard(card);
  };

  const handleBan = () => {
    updateCardFrequency(cardName, 0);
    setPreviewedCard(card);
  };

  return (
    <div
      key={cardName}
      className="flex items-center justify-between bg-white/5 rounded p-3 cursor-pointer hover:bg-white/10 transition-colors"
      onClick={() => setPreviewedCard(card)}
    >
      <div className="flex-1">
        <h3 className="font-medium text-white">{cardName}</h3>
        <p className="text-sm text-green-200">
          (Default: {DEFAULT_CARD_FREQUENCIES[cardName] ?? 1})
        </p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="1"
          max="20"
          value={frequency}
          onChange={(e) => {
            const newValue = parseInt(e.target.value) || 1;
            if (newValue >= 1) {
              handleFrequencyChange(newValue);
            }
          }}
          className="w-16 px-2 py-1 text-center bg-white/20 text-white rounded border border-white/30"
          onClick={(e) => e.stopPropagation()}
        />
        <Button
          variant="danger"
          onClick={(e) => {
            e.stopPropagation();
            handleBan();
          }}
        >
          Ban
        </Button>
      </div>
    </div>
  );
};

const BannedCard = ({
  card,
  restoreCard,
  setPreviewedCard,
}: {
  card: Card;
  restoreCard: (cardName: string) => void;
  setPreviewedCard: (card: Card) => void;
}) => {
  const cardName = card.name;

  const handleRestore = () => {
    restoreCard(cardName);
    setPreviewedCard(card);
  };

  return (
    <div
      key={cardName}
      className="flex items-center justify-between bg-red-500/20 rounded p-3 cursor-pointer hover:bg-red-500/30 transition-colors"
      onClick={() => setPreviewedCard(card)}
    >
      <div className="flex-1">
        <h3 className="font-medium text-white">{cardName}</h3>
        <p className="text-sm text-red-200">
          (Default: {DEFAULT_CARD_FREQUENCIES[cardName] ?? 1})
        </p>
      </div>
      <Button
        variant="default"
        onClick={(e) => {
          e.stopPropagation();
          handleRestore();
        }}
      >
        Restore
      </Button>
    </div>
  );
};

const CardPreview = ({ card }: { card: Card | null }) => {
  if (!card) {
    return (
      <div className="p-8 text-center">
        <p className="italic">Click on a card to preview it</p>
      </div>
    );
  }

  const cardName = card.name;

  return (
    <div className="text-center flex justify-center w-full h-full min-h-[300px]">
      <img
        src={require(`../${getCardPath(card.expansionName, card.imageKey)}`)}
        alt={cardName}
        className={`max-w-[100%] max-h-[375px] object-contain rounded-lg bg-neutral-800 transition-opacity duration-0`}
      />
    </div>
  );
};

const CardManagement: React.FC = () => {
  const { cardFrequencies, updateCardFrequency, resetToDefaults, isModified } =
    useCardManagement();
  const [previewedCard, setPreviewedCard] = useState<Card | null>(null);

  const handleRestoreCard = (cardName: string) => {
    const originalCard = findCard(cardName);
    if (originalCard) {
      updateCardFrequency(cardName, DEFAULT_CARD_FREQUENCIES[cardName] ?? 1);
    }
  };

  const bannedCards = Object.entries(cardFrequencies).filter(
    ([_, frequency]) => frequency === 0,
  );
  const activeCards = Object.entries(cardFrequencies).filter(
    ([_, frequency]) => frequency > 0,
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto p-4 flex flex-col h-screen gap-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <Navigation
            link={HOME_PATH}
            displayText="Back to Home"
            arrow="backward"
          />
        </div>

        {/* Modification Alert */}
        <Alert
          displayText="Custom card frequencies are active"
          secondaryText="New games will use these modified frequencies"
          variant="warning"
          visible={isModified}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Cards */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Active Cards ({activeCards.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(() => {
                const cardsByExpansion = groupCardsByExpansion(activeCards);
                const sortedExpansions = Object.keys(cardsByExpansion).sort();

                return sortedExpansions.map((expansion) => (
                  <div key={expansion} className="space-y-2">
                    <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-1">
                      {formatExpansionName(expansion)}
                    </h3>
                    <div className="space-y-2 ml-4">
                      {cardsByExpansion[expansion]
                        .sort((a, b) => a.card.name.localeCompare(b.card.name))
                        .map(({ card, frequency }) => (
                          <ActiveCard
                            key={card.name}
                            card={card}
                            frequency={frequency}
                            updateCardFrequency={updateCardFrequency}
                            setPreviewedCard={setPreviewedCard}
                          />
                        ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Banned Cards */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Banned Cards ({bannedCards.length})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {bannedCards.length === 0 ? (
                <p className="italic text-center py-8">
                  No cards are currently banned
                </p>
              ) : (
                (() => {
                  const bannedCardsByExpansion =
                    groupCardsByExpansion(bannedCards);
                  const sortedExpansions = Object.keys(
                    bannedCardsByExpansion,
                  ).sort();

                  return sortedExpansions.map((expansion) => (
                    <div key={expansion} className="space-y-2">
                      <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-1">
                        {expansion.charAt(0).toUpperCase() + expansion.slice(1)}
                      </h3>
                      <div className="space-y-2 ml-4">
                        {bannedCardsByExpansion[expansion]
                          .sort((a, b) =>
                            a.card.name.localeCompare(b.card.name),
                          )
                          .map(({ card }) => (
                            <BannedCard
                              key={card.name}
                              card={card}
                              restoreCard={handleRestoreCard}
                              setPreviewedCard={setPreviewedCard}
                            />
                          ))}
                      </div>
                    </div>
                  ));
                })()
              )}
            </div>
          </div>

          {/* Card Preview */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Card Preview
            </h2>
            <CardPreview card={previewedCard} />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-6 bg-white/10 backdrop-blur-sm rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Quick Actions
          </h2>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="important"
              onClick={resetToDefaults}
              disabled={!isModified}
            >
              Reset to Defaults
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                rawCards
                  .filter((card) => card.expansionName === "base")
                  .forEach((card) => {
                    updateCardFrequency(card.name, 0);
                  });
              }}
            >
              Ban All Base Cards
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                rawCards
                  .filter((card) => card.expansionName === "extra extra")
                  .forEach((card) => {
                    updateCardFrequency(card.name, 0);
                  });
              }}
            >
              Ban All Extra Extra Cards
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardManagement;
