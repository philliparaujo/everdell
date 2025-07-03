import { ReactNode } from "react";
import { useGame } from "../engine/GameContext";
import { Location, ResourceType, Visitable } from "../engine/gameTypes";
import { canVisitLocation, isNotYourTurn } from "../utils/gameLogic";
import { getPlayerColor, getPlayerId } from "../utils/identity";
import { mapOverResources } from "../utils/loops";
import { styleLocationBorderColor } from "../utils/tailwind";
import Button from "./Button";
import { ResourceIcon, WorkerIcon } from "./Icons";

export function renderButtons(
  visitDisabled: boolean,
  leaveDisabled: boolean,
  onVisit: () => void,
  onLeave: () => void,
) {
  return (
    <div>
      <Button disabled={visitDisabled} onClick={onVisit}>
        Visit
      </Button>
      <Button disabled={leaveDisabled} onClick={onLeave}>
        Leave
      </Button>
    </div>
  );
}

export function renderWorkers(location: Visitable) {
  return (
    <div className="flex h-6 content-center gap-2">
      {location.workers.Red > 0 && (
        <span className="flex items-center gap-1">
          <WorkerIcon playerColor={"Red"} /> {location.workers.Red}
        </span>
      )}
      {location.workers.Blue > 0 && (
        <span className="flex items-center gap-1">
          <WorkerIcon playerColor={"Blue"} /> {location.workers.Blue}
        </span>
      )}
    </div>
  );
}

export function BaseLocationDisplay({
  buttonChildren,
  workerChildren,
  resourceChildren,
  titleChildren = null,
  exclusive = false,
  used = false,
  wide = false,
}: {
  buttonChildren: ReactNode;
  workerChildren: ReactNode;
  resourceChildren: ReactNode;
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
      <div className="flex-1 flex flex-col justify-center">
        {buttonChildren}
      </div>
      {titleChildren && (
        <div className="text-[10px] pt-0.5">{titleChildren}</div>
      )}
      {workerChildren}
      <div className="flex flex-wrap items-center gap-0.5">
        {resourceChildren}
      </div>
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
    playerColor === null
      ? false
      : canVisitLocation(game, location, playerColor, 1);
  const canLeave =
    playerColor === null
      ? false
      : canVisitLocation(game, location, playerColor, -1);

  return (
    <BaseLocationDisplay
      exclusive={location.exclusive}
      buttonChildren={renderButtons(
        disabled || !canVisit,
        disabled || !canLeave,
        () => visitLocation(storedId, index, 1),
        () => visitLocation(storedId, index, -1),
      )}
      workerChildren={renderWorkers(location)}
      resourceChildren={
        <>
          {mapOverResources(location.resources, (key, val) => (
            <div key={key} className="flex items-center gap-1">
              <ResourceIcon type={key as ResourceType} /> {val}
            </div>
          ))}
        </>
      }
    />
  );
}

function HavenDisplay() {
  const { game, visitLocation } = useGame();

  const storedId = getPlayerId();
  const playerColor = getPlayerColor(game, storedId);

  const havenLocation = game.locations[game.locations.length - 1];

  const disabled = isNotYourTurn(game, storedId);
  const canVisit =
    playerColor === null
      ? false
      : canVisitLocation(game, havenLocation, playerColor, 1);
  const canLeave =
    playerColor === null
      ? false
      : canVisitLocation(game, havenLocation, playerColor, -1);

  return (
    <BaseLocationDisplay
      buttonChildren={renderButtons(
        disabled || !canVisit,
        disabled || !canLeave,
        () => visitLocation(storedId, game.locations.length - 1, 1),
        () => visitLocation(storedId, game.locations.length - 1, -1),
      )}
      workerChildren={renderWorkers(havenLocation)}
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
    <div className="flex gap-2">
      {game.locations
        .slice(0, game.locations.length - 1)
        .map((location: Location, index: number) => (
          <LocationDisplay location={location} index={index} />
        ))}

      <br />

      <HavenDisplay />
    </div>
  );
}

export default LocationsDisplay;
