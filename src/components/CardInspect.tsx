import { useState } from "react";
import { useGame } from "../engine/GameContext";
import { defaultResources } from "../engine/gameDefaults";
import { Card, PlayerColor, ResourceType } from "../engine/gameTypes";
import { canVisitCardInCity, isNotYourTurn } from "../utils/gameLogic";
import { getPlayerColor, getPlayerId } from "../utils/identity";
import { mapOverResources } from "../utils/loops";
import Button from "./Button";
import { ResourceIcon } from "./Icons";
import Inspectable from "./Inspectable";
import { renderVisitButtons, renderVisitingWorkers } from "../utils/react";

function CardInspect({
  card,
  index,
  cityColor,
  onClose,
  placedDown,
}: {
  card: Card;
  index: number;
  cityColor: PlayerColor | null;
  onClose: () => void;
  placedDown: boolean;
}) {
  const {
    game,
    visitCardInCity,
    addResourcesToCardInCity,
    toggleOccupiedCardInCity,
  } = useGame();

  const [imageLoaded, setImageLoaded] = useState(false);
  const storedId = getPlayerId();
  const playerColor = getPlayerColor(game, storedId);

  const disabled = isNotYourTurn(game, storedId);
  const canVisit =
    playerColor && canVisitCardInCity(game, card, playerColor, 1);
  const canLeave =
    playerColor && canVisitCardInCity(game, card, playerColor, -1);

  const textColor = card?.occupied
    ? "text-cardPreviewOutline-occupied"
    : "text-text";

  return (
    <Inspectable onClose={onClose}>
      <img
        src={require(
          `../assets/cards/${card.expansionName}/${card.imageKey}.jpg`,
        )}
        alt={card.name}
        className={`max-w-[50%] object-contain rounded-lg aspect-5/7 bg-neutral-800 transition-opacity duration-0 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImageLoaded(true)}
      />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto min-w-0">
        <h1 className="text-3xl font-bold">{card.name}</h1>
        {card.value !== undefined && (
          <p>
            <strong>Base Points:</strong> {card.value}
          </p>
        )}
        {placedDown && card.occupied !== null && cityColor ? (
          <div className="flex gap-2 justify-center">
            <strong className={textColor}>Occupied:</strong>
            <Button
              disabled={disabled}
              onClick={() =>
                toggleOccupiedCardInCity(
                  storedId,
                  cityColor,
                  index,
                  !card.occupied,
                )
              }
            >
              {card.occupied ? "Yes" : "No"}
            </Button>
          </div>
        ) : (
          <></>
        )}

        {placedDown && card.storage && (
          <div className="grid grid-cols-2 gap-4 mx-auto">
            {mapOverResources(
              card.storage,
              (key, val) => {
                return key === "cards" ? (
                  <></>
                ) : (
                  <div key={key} className="flex gap-1 justify-center">
                    <div className="flex items-center gap-0">
                      <ResourceIcon type={key as ResourceType} />
                      <span>{val}</span>
                    </div>
                    <div className="flex">
                      <Button
                        disabled={disabled}
                        onClick={() =>
                          addResourcesToCardInCity(storedId, game.turn, index, {
                            ...defaultResources,
                            [key]: -1,
                          })
                        }
                      >
                        -
                      </Button>
                      <Button
                        disabled={disabled}
                        onClick={() =>
                          addResourcesToCardInCity(storedId, game.turn, index, {
                            ...defaultResources,
                            [key]: 1,
                          })
                        }
                      >
                        +
                      </Button>
                    </div>
                  </div>
                );
              },
              false,
            )}
          </div>
        )}

        {placedDown && card.maxDestinations != null && (
          <div className="flex flex-col items-center text-center">
            {cityColor !== null &&
              renderVisitButtons(
                disabled || !canVisit,
                disabled || !canLeave,
                () => visitCardInCity(storedId, cityColor, index, 1),
                () => visitCardInCity(storedId, cityColor, index, -1),
              )}
            {card.workers && renderVisitingWorkers(card)}
          </div>
        )}
      </div>
    </Inspectable>
  );
}

export default CardInspect;
