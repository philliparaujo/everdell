import React from 'react';
import { GameState, Location, PlayerColor } from '../engine/gameTypes';

function LocationsDisplay({ game, visitLocation }: { game: GameState, visitLocation: (playerColor: PlayerColor, index: number) => void }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
      {game.locations.map((location: Location, index: number) => (
        <div key={index} style={{ background: '#eee', padding: '8px', borderRadius: '8px' }}>
          <strong>Location {index + 1}</strong>
          <div>
            <button onClick={() => visitLocation(game.turn, index)}>{"Visit"}</button>
            {location.exclusive ? " (exclusive)" : <></>}
          </div>
          <div>
            {`Red workers: ${location.workers.Red}`}
          </div>
          <div>
            {`Blue workers: ${location.workers.Blue}`}
          </div>

          <hr />

          {Object.entries(location.resources)
            .filter(([, val]) => val > 0)
            .map(([key, val]) => (
              <div key={key}>{key}: {val}</div>
            ))}
        </div>
      ))}
    </div>
  );
}

export default LocationsDisplay;
