import { ReactNode } from 'react';
import { useGame } from '../engine/GameContext';
import { Event } from "../engine/gameTypes";
import { Location, ResourceType } from '../engine/gameTypes';
import { getPlayerId, isNotYourTurn, mapOverResources } from '../engine/helpers';
import { ResourceIcon, WorkerIcon } from './Icons';

const locationStyling: React.CSSProperties = {
  width: '100px',
  background: '#DCBA9E',
  padding: '0px',
  border: 'solid 2px #DCBA9E',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center'
}

export const locationsDisplayStyling: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
}

const workerStyling: React.CSSProperties = {
  display: 'flex', height: '25px', alignContent: 'center', gap: '8px'
};
const resourceStyling: React.CSSProperties = {
  display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px'
};
export const arrowResourceStyling: React.CSSProperties = {
  ...resourceStyling, gap: '2px', alignItems: 'center'
}

export function renderButtons(disabled: boolean, onVisit: () => void, onLeave: () => void) {
  return (
    <div>
      <button disabled={disabled} onClick={onVisit}>
        Visit
      </button>
      <button disabled={disabled} onClick={onLeave}>
        Leave
      </button>
    </div>
  )
}

export function renderWorkers(location: Location | Event) {
  return (
    <div style={workerStyling}>
      {location.workers.Red > 0 && (
        <span><WorkerIcon playerColor={"Red"} /> {location.workers.Red}</span>
      )}
      {location.workers.Blue > 0 && (
        <span><WorkerIcon playerColor={"Blue"} /> {location.workers.Blue}</span>
      )}
    </div>
  )
}

export function BaseLocationDisplay({ buttonChildren, workerChildren, resourceChildren, exclusive = false }: { buttonChildren: ReactNode, workerChildren: ReactNode, resourceChildren: ReactNode, exclusive?: Boolean }) {
  return (
    <div
      style={{
        ...locationStyling,
        border: exclusive ? 'solid 2px black' : 'solid 2px #DCBA9E',
      }}
    >
      {buttonChildren}
      {workerChildren}
      {resourceChildren}
    </div>
  );
}

function LocationDisplay({ location, index }: { location: Location, index: number }) {
  const { game, visitLocation } = useGame();

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

  return (
    <BaseLocationDisplay
      exclusive={location.exclusive}
      buttonChildren={
        renderButtons(
          disabled,
          () => visitLocation(storedId, index, 1),
          () => visitLocation(storedId, index, -1)
        )
      }
      workerChildren={renderWorkers(location)}
      resourceChildren={(
        <div style={resourceStyling}>
          {
            mapOverResources(location.resources, (key, val) => (
              <div key={key}>
                <ResourceIcon type={key as ResourceType} /> {val}
              </div>
            ))
          }
        </div>
      )}
    />
  );
}

function HavenDisplay() {
  const { game, visitLocation } = useGame();

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

  const havenLocation = game.locations[game.locations.length - 1];

  return (
    <BaseLocationDisplay
      buttonChildren={
        renderButtons(
          disabled,
          () => visitLocation(storedId, game.locations.length - 1, 1),
          () => visitLocation(storedId, game.locations.length - 1, -1)
        )
      }
      workerChildren={renderWorkers(havenLocation)}
      resourceChildren={(
        <div style={arrowResourceStyling}>
          <ResourceIcon type={"cards"} /> {-2}
          {"→"}
          <ResourceIcon type={"wildcard"} /> {1}
        </div>
      )}
    />
  )
}

function LocationsDisplay() {
  const { game } = useGame();

  return (
    <div style={locationsDisplayStyling}>
      {game.locations.slice(0, game.locations.length - 1).map((location: Location, index: number) => (
        <LocationDisplay location={location} index={index} />
      ))}

      <br />

      <HavenDisplay />
    </div>
  );
}

export default LocationsDisplay;