import { ReactNode } from "react";
import { useGame } from "../engine/GameContext";
import { Location, ResourceType } from "../engine/gameTypes";
import { canVisitLocation, isNotYourTurn } from "../utils/gameLogic";
import { getPlayerColor, getPlayerId } from "../utils/identity";
import { mapOverResources } from "../utils/loops";
import {
  renderPlacedCharacters,
  renderVisitButtons,
  renderVisitingWorkers,
} from "../utils/react";
import { styleLocationBorderColor } from "../utils/tailwind";
import Hoverable from "./Hoverable";
import { ResourceIcon } from "./Icons";
import LocationInspect from "./LocationInspect";

export function BaseLocationDisplay({
  buttonChildren,
  workerChildren,
  resourceChildren,
  characterChildren = null,
  storageChildren = null,
  titleChildren = null,
  exclusive = false,
  used = false,
  wide = false,
}: {
  buttonChildren: ReactNode;
  workerChildren: ReactNode;
  resourceChildren: ReactNode;
  characterChildren?: ReactNode;
  storageChildren?: ReactNode;
  titleChildren?: ReactNode;
  exclusive?: boolean;
  used?: boolean;
  wide?: boolean;
}) {
  return (
    <div
      className={`flex flex-col rounded-lg items-center text-center border-2 bg-location-default ${styleLocationBorderColor(used, exclusive)}`}
      style={{
        width: wide ? "150px" : "96px",
      }}
    >
      <div className="flex flex-col justify-center">{buttonChildren}</div>
      {titleChildren && (
        <div className="text-[10px] pt-0.5">{titleChildren}</div>
      )}
      {workerChildren}
      {characterChildren}
      <div className="mt-auto">
        <div className="flex flex-wrap items-center gap-0.5">
          {resourceChildren}
        </div>
      </div>

      {storageChildren && (
        <div className="w-full flex-shrink-0 flex flex-wrap justify-evenly items-center rounded-b bg-location-storage p-1">
          {storageChildren}
        </div>
      )}
    </div>
  );
}

function LocationDisplay({
  location,
  index,
}: {
  location: Location;
  index: number;
}) {
  const { game, visitLocation } = useGame();

  const storedId = getPlayerId();
  const playerColor = getPlayerColor(game, storedId);

  const disabled = isNotYourTurn(game, storedId);
  const canVisit =
    playerColor && canVisitLocation(game, location, playerColor, 1);
  const canLeave =
    playerColor && canVisitLocation(game, location, playerColor, -1);

  return (
    <Hoverable
      isInteractive={true}
      onRightClick={(closeInspector) => (
        <LocationInspect
          location={location}
          onClose={closeInspector}
          index={index}
        />
      )}
    >
      <BaseLocationDisplay
        exclusive={location.exclusive}
        buttonChildren={renderVisitButtons(
          disabled || !canVisit,
          disabled || !canLeave,
          () => visitLocation(storedId, index, 1),
          () => visitLocation(storedId, index, -1),
        )}
        workerChildren={renderVisitingWorkers(location)}
        characterChildren={renderPlacedCharacters(location)}
        resourceChildren={mapOverResources(location.resources, (key, val) => (
          <div key={key} className="flex items-center gap-1">
            <ResourceIcon type={key as ResourceType} /> {val}
          </div>
        ))}
        storageChildren={
          location.storage &&
          mapOverResources(
            location.storage,
            (key, val) => (
              <div key={key} className="flex items-center text-[10px]">
                <ResourceIcon type={key as ResourceType} /> {val}
              </div>
            ),
            true,
            () => null,
          )
        }
      />
    </Hoverable>
  );
}

function HavenDisplay() {
  const { game, visitLocation } = useGame();

  const storedId = getPlayerId();
  const playerColor = getPlayerColor(game, storedId);

  const havenLocation = game.locations[game.locations.length - 1];

  const disabled = isNotYourTurn(game, storedId);
  const canVisit =
    playerColor && canVisitLocation(game, havenLocation, playerColor, 1);
  const canLeave =
    playerColor && canVisitLocation(game, havenLocation, playerColor, -1);

  return (
    <BaseLocationDisplay
      buttonChildren={renderVisitButtons(
        disabled || !canVisit,
        disabled || !canLeave,
        () => visitLocation(storedId, game.locations.length - 1, 1),
        () => visitLocation(storedId, game.locations.length - 1, -1),
      )}
      workerChildren={renderVisitingWorkers(havenLocation)}
      resourceChildren={
        <>
          <ResourceIcon type={"cards"} /> {-2}
          {"→"}
          <ResourceIcon type={"wildcards"} /> {1}
        </>
      }
    />
  );
}

function LocationsDisplay() {
  const { game } = useGame();

  return (
    <div className="flex gap-2 items-start">
      {game.locations
        .slice(0, game.locations.length - 1)
        .map((location: Location, index: number) => (
          <LocationDisplay location={location} index={index} key={index} />
        ))}

      <div className="ml-2">
        <HavenDisplay />
      </div>
    </div>
  );
}

export default LocationsDisplay;
