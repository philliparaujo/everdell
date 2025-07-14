import { useGame } from "../engine/GameContext";
import { defaultResources } from "../engine/gameDefaults";
import { CharacterType, Location, ResourceType } from "../engine/gameTypes";
import {
  canAddResourcesToLocation,
  canPlaceCharacterOnLocation,
  canVisitLocation,
  isNotYourTurn,
} from "../utils/gameLogic";
import { getPlayerColor, getPlayerId } from "../utils/identity";
import { mapOverCharacters, mapOverResources } from "../utils/loops";
import {
  renderPlacedCharacters,
  renderVisitButtons,
  renderVisitingWorkers,
} from "../utils/react";
import Button from "./Button";
import { ResourceIcon } from "./Icons";
import Inspectable from "./Inspectable";

function LocationInspect({
  location,
  onClose,
  index,
}: {
  location: Location;
  onClose: () => void;
  index: number;
}) {
  const {
    game,
    visitLocation,
    addResourcesToLocation,
    placeCharacterOnLocation,
  } = useGame();

  const storedId = getPlayerId();
  const playerColor = getPlayerColor(game, storedId);

  const disabled = isNotYourTurn(game, storedId);
  const canVisit =
    playerColor && canVisitLocation(game, location, playerColor, 1);
  const canLeave =
    playerColor && canVisitLocation(game, location, playerColor, -1);
  const canAddResource =
    playerColor && canAddResourcesToLocation(game, location, playerColor);

  return (
    <Inspectable onClose={onClose}>
      <div className="flex flex-1 flex-col overflow-y-auto min-w-96 gap-6 max-h-[100%] items-center">
        {/* --- Resources --- */}
        <div className="flex items-center gap-2">
          <strong>Resources:</strong>
          {mapOverResources(location.resources, (key, val) => (
            <div key={key} className="flex items-center gap-1">
              <ResourceIcon type={key as ResourceType} /> {val}
            </div>
          ))}
        </div>

        {/* --- Storage --- */}
        {location.storage && (
          <div className="grid grid-cols-2 gap-4 mx-auto">
            {mapOverResources(
              location.storage,
              (key, val) => {
                return key === "cards" ||
                  key === "wildcards" ||
                  key === "coins" ? (
                  <></>
                ) : (
                  <div key={key} className="flex gap-1 justify-center">
                    <div className="flex items-center gap-0">
                      <ResourceIcon type={key as ResourceType} />
                      <span>{val}</span>
                    </div>
                    <div className="flex">
                      <Button
                        disabled={disabled || !canAddResource}
                        onClick={() =>
                          addResourcesToLocation(storedId, index, {
                            ...defaultResources,
                            [key]: -1,
                          })
                        }
                      >
                        -
                      </Button>
                      <Button
                        disabled={disabled || !canAddResource}
                        onClick={() =>
                          addResourcesToLocation(storedId, index, {
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

        {/* --- Visiting --- */}
        <div className="flex flex-col items-center">
          {renderVisitButtons(
            disabled || !canVisit,
            disabled || !canLeave,
            () => visitLocation(storedId, index, 1),
            () => visitLocation(storedId, index, -1),
          )}
          {renderVisitingWorkers(location)}
        </div>

        {/* --- Placing character */}
        {location.characters && playerColor && (
          <div className="flex flex-col items-center gap-2">
            {mapOverCharacters((character: CharacterType) => {
              if (
                canPlaceCharacterOnLocation(
                  game,
                  location,
                  playerColor,
                  1,
                  character,
                )
              ) {
                return (
                  <div>
                    <Button
                      disabled={
                        disabled ||
                        !canPlaceCharacterOnLocation(
                          game,
                          location,
                          playerColor,
                          1,
                          character,
                        )
                      }
                      onClick={() =>
                        placeCharacterOnLocation(storedId, index, 1, character)
                      }
                    >
                      {`Place ${character}`}
                    </Button>
                    <Button
                      disabled={
                        disabled ||
                        !canPlaceCharacterOnLocation(
                          game,
                          location,
                          playerColor,
                          -1,
                          character,
                        )
                      }
                      onClick={() =>
                        placeCharacterOnLocation(storedId, index, -1, character)
                      }
                    >
                      {`Remove`}
                    </Button>
                  </div>
                );
              } else {
                return <></>;
              }
            })}
            {renderPlacedCharacters(location)}
          </div>
        )}
      </div>
    </Inspectable>
  );
}

export default LocationInspect;
