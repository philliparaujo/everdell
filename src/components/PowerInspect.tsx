import { useGame } from "../engine/GameContext";
import { defaultResources } from "../engine/gameDefaults";
import { Power, ResourceType } from "../engine/gameTypes";
import { getCardPath } from "../utils/card";
import { canAddResourcesToPower, isNotYourTurn } from "../utils/gameLogic";
import { getPlayerColor, getPlayerId } from "../utils/identity";
import { mapOverResources } from "../utils/loops";
import { renderTextWithIcons } from "../utils/react";
import Button from "./Button";
import { ResourceIcon } from "./Icons";
import Inspectable from "./Inspectable";

function PowerInspect({
  power,
  onClose,
  inGame,
  renderPowerToggleButtons,
  renderStartButton,
}: {
  power: Power;
  onClose: () => void;
  inGame: boolean;
  renderPowerToggleButtons?: () => React.ReactNode;
  renderStartButton?: () => React.ReactNode;
}) {
  const imageSrc = require(
    `../${getCardPath(power.expansionName, power.imageKey)}`,
  );

  return (
    <Inspectable onClose={onClose}>
      {/* A single vertical column for all content */}
      <div className="flex flex-1 flex-col h-[36rem] overflow-y-auto w-[36rem] gap-6 items-center p-6">
        {/* --- Cropped Image Banner --- */}
        <div
          className="w-full h-52 bg-top bg-cover rounded-lg flex-shrink-0"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />

        <div className="flex flex-col gap-1">
          {/* --- Name --- */}
          <h1 className="text-2xl font-bold">{power.name}</h1>

          {/* --- Title --- */}
          <h2 className="text-lg">{power.title}</h2>
        </div>

        {/* --- Text Details --- */}
        <div className="flex flex-col gap-4 text-center">
          {/* Description */}
          <div className="flex flex-col gap-1">
            <strong>Description:</strong>
            <p className="text-center">
              {renderTextWithIcons(power.description)}
            </p>
          </div>

          {/* Stored Resources */}
          {inGame && <PowerInspectInGame power={power} />}
        </div>

        <div className="mt-auto flex flex-col gap-2">
          {renderPowerToggleButtons && (
            <div className="flex flex-row justify-center h-6">
              {renderPowerToggleButtons()}
            </div>
          )}

          {renderStartButton && (
            <div className="flex flex-row justify-center h-6">
              {renderStartButton()}
            </div>
          )}
        </div>
      </div>
    </Inspectable>
  );
}

function PowerInspectInGame({ power }: { power: Power }) {
  // now it’s safe to call the hook, because we only
  // render this component when inGame === true:
  const { game, addResourcesToPower } = useGame();

  const playerId = getPlayerId()!;
  const playerColor = getPlayerColor(game, playerId);
  const disabled = isNotYourTurn(game, playerId);
  const canAdd = playerColor
    ? canAddResourcesToPower(game, power, playerColor)
    : false;

  return (
    <>
      {/* storage grid */}
      {power.storage && (
        <div className="grid grid-cols-2 gap-4 mx-auto">
          {mapOverResources(
            power.storage,
            (key, val) =>
              key === "wildcards" ? null : (
                <div key={key} className="flex gap-1 justify-center">
                  <div className="flex items-center gap-0">
                    <ResourceIcon type={key as ResourceType} />
                    <span>{val}</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      disabled={disabled || !canAdd}
                      onClick={() =>
                        addResourcesToPower(playerId, {
                          ...defaultResources,
                          [key]: -1,
                        })
                      }
                    >
                      -
                    </Button>
                    <Button
                      disabled={disabled || !canAdd}
                      onClick={() =>
                        addResourcesToPower(playerId, {
                          ...defaultResources,
                          [key]: +1,
                        })
                      }
                    >
                      +
                    </Button>
                  </div>
                </div>
              ),
            false,
          )}
        </div>
      )}
    </>
  );
}

export default PowerInspect;
