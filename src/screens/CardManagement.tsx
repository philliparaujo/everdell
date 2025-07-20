import React, { useState } from "react";
import {
  BASE_CARD_FREQUENCIES,
  DEFAULT_CARD_FREQUENCIES,
  rawCards,
} from "../assets/data/cards";
import Alert from "../components/Alert";
import Button from "../components/Button";
import Navigation from "../components/Navigation";
import { useCardManagement } from "../engine/CardManagementContext";
import { Card, EXPANSION_NAMES, ExpansionName } from "../engine/gameTypes";
import {
  findCard,
  formatExpansionName,
  getActiveCards,
  getBannedCards,
  getCardPath,
  groupCardsByExpansion,
} from "../utils/card";
import { HOME_PATH } from "../utils/navigation";
import { renderActiveExpansions, renderPowersEnabled } from "../utils/react";

const ActiveCard = ({
  card,
  frequency,
  updateCardFrequency,
  setPreviewedCard,
}: {
  card: Card;
  frequency: number;
  updateCardFrequency: (
    cardName: string,
    expansionName: ExpansionName,
    frequency: number,
  ) => void;
  setPreviewedCard: (card: Card) => void;
}) => {
  const cardName = card.name;
  const expansionName = card.expansionName;

  const handleFrequencyChange = (newFrequency: number) => {
    updateCardFrequency(cardName, expansionName, newFrequency);
    setPreviewedCard(card);
  };

  const handleBan = () => {
    updateCardFrequency(cardName, expansionName, 0);
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
          (Default: {BASE_CARD_FREQUENCIES[expansionName][cardName] ?? 1})
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
  restoreCard: (cardName: string, expansionName: ExpansionName) => void;
  setPreviewedCard: (card: Card) => void;
}) => {
  const cardName = card.name;
  const expansionName = card.expansionName;

  const handleRestore = () => {
    restoreCard(cardName, expansionName);
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
          (Default: {BASE_CARD_FREQUENCIES[expansionName][cardName] ?? 1})
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
  const {
    cardFrequencies,
    activeExpansions,
    powersEnabled,
    updateCardFrequency,
    toggleExpansion,
    togglePowersEnabled,
    resetToDefaults,
    isModified,
  } = useCardManagement();
  const [previewedCard, setPreviewedCard] = useState<Card | null>(null);

  const handleRestoreCard = (
    cardName: string,
    expansionName: ExpansionName,
  ) => {
    const originalCard = findCard(cardName);
    if (originalCard) {
      updateCardFrequency(
        cardName,
        expansionName,
        BASE_CARD_FREQUENCIES[expansionName][cardName] ?? 1,
      );
    }
  };

  const activeCards = getActiveCards(cardFrequencies);
  const bannedCards = getBannedCards(cardFrequencies);

  const totalActiveCards = activeCards.reduce(
    (acc, [_, frequencies]) =>
      acc +
      Object.values(frequencies).reduce((acc, frequency) => acc + frequency, 0),
    0,
  );
  // Total copies of cards you’ve banned, based on their base frequency
  const totalBannedCards = bannedCards.reduce(
    (sumExp, [expansionName, frequencies]) =>
      sumExp +
      Object.keys(frequencies).reduce(
        (sumCard, cardName) =>
          sumCard + (BASE_CARD_FREQUENCIES[expansionName]?.[cardName] ?? 1),
        0,
      ),
    0,
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
          displayText={
            isModified
              ? "Using custom card frequencies"
              : "Using default card frequencies"
          }
          secondaryDisplay={renderActiveExpansions(activeExpansions)}
          tertiaryDisplay={renderPowersEnabled(powersEnabled)}
          variant={isModified ? "warning" : "info"}
          visible={true}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Cards */}
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Active Cards ({totalActiveCards})
            </h2>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(() => {
                const cardsByExpansion = groupCardsByExpansion(activeCards);
                const sortedExpansions: ExpansionName[] = Object.keys(
                  cardsByExpansion,
                )
                  .map((expansion) => expansion as ExpansionName)
                  .sort();

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
              Banned Cards ({totalBannedCards})
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
                  const sortedExpansions: ExpansionName[] = Object.keys(
                    bannedCardsByExpansion,
                  )
                    .map((expansion) => expansion as ExpansionName)
                    .sort();

                  return sortedExpansions.map((expansion) => (
                    <div key={expansion} className="space-y-2">
                      <h3 className="text-lg font-semibold text-white border-b border-white/20 pb-1">
                        {formatExpansionName(expansion)}
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
              variant={powersEnabled ? "danger" : "important"}
              onClick={togglePowersEnabled}
            >
              {powersEnabled ? "Disable powers" : "Enable powers"}
            </Button>
            {EXPANSION_NAMES.map((expansion) => (
              <Button
                key={expansion}
                variant={
                  activeExpansions.includes(expansion) ? "danger" : "important"
                }
                onClick={() => {
                  const willInclude = !activeExpansions.includes(expansion);

                  toggleExpansion(expansion);
                  rawCards
                    .filter((card) => card.expansionName === expansion)
                    .forEach((card) => {
                      updateCardFrequency(
                        card.name,
                        card.expansionName,
                        willInclude
                          ? BASE_CARD_FREQUENCIES[expansion][card.name]
                          : 0,
                      );
                    });
                }}
              >
                {activeExpansions.includes(expansion)
                  ? "Exclude " + formatExpansionName(expansion) + " Expansion"
                  : "Include " + formatExpansionName(expansion) + " Expansion"}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardManagement;
