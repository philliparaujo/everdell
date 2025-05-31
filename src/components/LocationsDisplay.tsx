import { ReactNode } from 'react';
import { useGame } from '../engine/GameContext';
import { Location, ResourceType } from '../engine/gameTypes';
import { getPlayerId, isNotYourTurn, mapOverResources } from '../engine/helpers';
import { ResourceIcon, WorkerIcon } from './Icons';

const workerStyling: React.CSSProperties = {
  display: 'flex', height: '25px', alignContent: 'center', gap: '8px'
};
const resourceStyling: React.CSSProperties = {
  display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px'
};

function BaseLocationDisplay({ children }: { children: ReactNode }) {
  return (
    <div
      style={{
        width: '100px',
        height: '100px',
        background: '#DCBA9E',
        padding: '4px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      {children}
    </div>
  );
}

function LocationDisplay({ location, index }: { location: Location, index: number }) {
  const { game, visitLocation } = useGame();

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

  return (
    <BaseLocationDisplay>
      <div>
        <button disabled={disabled} onClick={() => visitLocation(storedId, index, 1)}>
          Visit{location.exclusive ? ' (excl.)' : ''}
        </button>
      </div>
      <div>
        <button disabled={disabled} onClick={() => visitLocation(storedId, index, -1)}>
          Unvisit
        </button>
      </div>

      <div style={workerStyling}>
        {location.workers.Red > 0 && (
          <span><WorkerIcon playerColor={"Red"} /> {location.workers.Red}</span>
        )}
        {location.workers.Blue > 0 && (
          <span><WorkerIcon playerColor={"Blue"} /> {location.workers.Blue}</span>
        )}
      </div>

      <div style={resourceStyling}>
        {
          mapOverResources(location.resources, (key, val) => (
            <div key={key}>
              <ResourceIcon type={key as ResourceType} /> {val}
            </div>
          ))
        }
      </div>
    </BaseLocationDisplay>
  );
}

function LocationsDisplay() {
  const { game, visitLocation } = useGame();

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

  const discardLocation = game.locations[game.locations.length - 1];

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
      {game.locations.slice(0, game.locations.length - 1).map((location: Location, index: number) => (
        <LocationDisplay location={location} index={index} />
      ))}

      <br />

      <BaseLocationDisplay>
        <div>
          <button disabled={disabled} onClick={() => visitLocation(storedId, game.locations.length - 1, 1)}>
            Visit
          </button>
        </div>
        <div>
          <button disabled={disabled} onClick={() => visitLocation(storedId, game.locations.length - 1, -1)}>
            Unvisit
          </button>
        </div>

        <div style={workerStyling}>
          {discardLocation.workers.Red > 0 && (
            <span><WorkerIcon playerColor={"Red"} /> {discardLocation.workers.Red}</span>
          )}
          {discardLocation.workers.Blue > 0 && (
            <span><WorkerIcon playerColor={"Blue"} /> {discardLocation.workers.Blue}</span>
          )}
        </div>

        <div style={{ ...resourceStyling, gap: '2px' }}>
          <ResourceIcon type={"cards"} /> {-2}
          {"→"}
          <ResourceIcon type={"wildcard"} /> {1}
        </div>
      </BaseLocationDisplay>
    </div>
  );
}

export default LocationsDisplay;