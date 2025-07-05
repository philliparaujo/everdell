import { useState } from "react";
import { useGame } from "../engine/GameContext";
import { defaultResources } from "../engine/gameDefaults";
import { Card, PlayerColor, ResourceType } from "../engine/gameTypes";
import { formatExpansionName, getCardPath } from "../utils/card";
import { canVisitCardInCity, isNotYourTurn } from "../utils/gameLogic";
import { getPlayerColor, getPlayerId } from "../utils/identity";
import { mapOverResources } from "../utils/loops";
import { renderVisitButtons, renderVisitingWorkers } from "../utils/react";
import Button from "./Button";
import { ResourceIcon } from "./Icons";
import Inspectable from "./Inspectable";

function CardInspect({
  card,
  index,
  cityColor,
  onClose,
  location,
}: {
  card: Card;
  index: number;
  cityColor: PlayerColor | null;
  onClose: () => void;
  location: "hand" | "city" | "meadow" | "reveal" | "discard";
}) {
  const {
    game,
    visitCardInCity,
    addResourcesToCardInCity,
    toggleOccupiedCardInCity,
    playCard,
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
        src={require(`../${getCardPath(card.expansionName, card.imageKey)}`)}
        alt={card.name}
        className={`w-[30vw] object-contain transition-opacity duration-0 ${
          imageLoaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setImageLoaded(true)}
      />
      <div className="flex flex-1 flex-col gap-4 overflow-y-auto w-[20vw] min-w-[20%]">
        <h1 className="text-3xl font-bold">{card.name}</h1>
        <p>
          <strong>Expansion:</strong> {formatExpansionName(card.expansionName)}
        </p>
        {card.value !== undefined && (
          <p>
            <strong>Point value:</strong> {card.value}
          </p>
        )}
        {location !== "city" && (
          <div>
            <Button
              disabled={disabled}
              onClick={() => {
                playCard(storedId, location, index);
                onClose();
              }}
            >
              Play
            </Button>
          </div>
        )}
        {location === "city" && card.occupied !== null && cityColor ? (
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

        {location === "city" && card.storage && (
          <div className="grid grid-cols-2 gap-4 mx-auto">
            {mapOverResources(
              card.storage,
              (key, val) => {
                return key === "cards" || key === "wildcards" ? (
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

        {location === "city" &&
          card.maxDestinations != null &&
          cityColor != null && (
            <div className="flex flex-col items-center text-center">
              {renderVisitButtons(
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
