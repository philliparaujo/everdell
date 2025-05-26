import { useGame } from '../engine/GameContext';
import { Location, ResourceType } from '../engine/gameTypes';
import { ResourceIcon, WorkerIcon } from './ResourceIcon';

function LocationDisplay({ location, index }: { location: Location, index: number }) {
  const {
    game,
    visitLocation,
  } = useGame();

  return (
    <div
      key={index}
      style={{
        width: '100px',
        height: '80px',
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
      <div>
        <button onClick={() => visitLocation(game.turn, index)}>
          Visit{location.exclusive ? ' (excl.)' : ''}
        </button>
      </div>

      <div>
        {location.workers.Red > 0 && (
          <span><WorkerIcon playerColor={"Red"} /> {location.workers.Red}</span>
        )}
        {location.workers.Blue > 0 && (
          <span><WorkerIcon playerColor={"Blue"} /> {location.workers.Blue}</span>
        )}
      </div>

      <br />

      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2px' }}>
        {Object.entries(location.resources)
          .filter(([, val]) => val > 0)
          .map(([key, val]) => (
            <div key={key}>
              <ResourceIcon type={key as ResourceType} /> {val}
            </div>
          ))}
      </div>
    </div>
  );
}

function LocationsDisplay() {
  const {
    game
  } = useGame();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
      {game.locations.map((location: Location, index: number) => (
        <LocationDisplay location={location} index={index} />
      ))}
    </div>
  );
}

export default LocationsDisplay;