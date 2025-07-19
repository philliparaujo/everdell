import { Power } from "../engine/gameTypes";
import { getCardPath } from "../utils/card";
import { renderTextWithIcons } from "../utils/react";
import Inspectable from "./Inspectable";

function PowerInspect({
  power,
  onClose,
  renderPowerToggleButtons,
  renderStartButton,
}: {
  power: Power;
  onClose: () => void;
  renderPowerToggleButtons?: () => React.ReactNode;
  renderStartButton?: () => React.ReactNode;
}) {
  const imageSrc = require(
    `../${getCardPath(power.expansionName, power.imageKey)}`,
  );

  return (
    <Inspectable onClose={onClose}>
      {/* A single vertical column for all content */}
      <div className="flex flex-1 flex-col overflow-y-auto w-[36rem] gap-6 items-center p-6">
        {/* --- Cropped Image Banner --- */}
        <div
          className="w-full h-52 bg-top bg-cover rounded-lg flex-shrink-0"
          style={{ backgroundImage: `url(${imageSrc})` }}
        />

        {/* --- Title --- */}
        <h1 className="text-2xl font-bold capitalize">
          {power.name.toLowerCase()}
        </h1>

        {/* --- Text Details --- */}
        <div className="flex flex-col gap-4 text-center">
          {/* Description */}
          <div className="flex flex-col gap-1">
            <strong>Description:</strong>
            <p className="m-0 text-white/90 flex flex-wrap items-center justify-center gap-1">
              {renderTextWithIcons(power.description)}
            </p>
          </div>

          {/* Stored Resources */}
          {/* {power.storage && (
            <div className="flex flex-col gap-2">
              <strong>Storage:</strong>
              <div className="flex flex-wrap items-center justify-center gap-3">
                {mapOverResources(
                  power.storage,
                  (key, val) => (
                    <div key={key} className="flex items-center gap-1">
                      <ResourceIcon type={key as ResourceType} /> {val}
                    </div>
                  ),
                  true,
                )}
              </div>
            </div>
          )} */}

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

export default PowerInspect;
