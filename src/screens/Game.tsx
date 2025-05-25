import CardPreview from '../components/CardPreview';
import LocationsDisplay from '../components/LocationsDisplay';
import { useGame } from '../engine/GameContext';
import { PlayerColor } from '../engine/gameTypes';

function Game() {
  const { game, endTurn, drawCard, addToMeadow, visitLocation } = useGame();
  const currentPlayer = game.players[game.turn];

  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif' }}>
      <h1 style={{ textAlign: 'center' }}>MY TURN</h1>

      {/* Locations display */}
      <LocationsDisplay game={game} visitLocation={visitLocation} />

      {/* Overlay: Player status panel */}
      <div style={{ position: 'absolute', top: 16, right: 16, background: '#fff', border: '1px solid #ccc', borderRadius: '8px', padding: '12px' }}>
        {(['Red', 'Blue'] as PlayerColor[]).map((color) => {
          const player = game.players[color];
          return (
            <div key={color} style={{ marginBottom: '12px' }}>
              <strong>{color} - {player.name || 'Username'}</strong>
              <div>Workers: {player.workers.workersLeft} / {player.workers.maxWorkers}</div>
              <div>Hand: {player.hand.length} / 8</div>
              <div>City: {player.city.length} / 15</div>
              {Object.entries(player.resources)
                .filter(([key, val]) => (
                  val.valueOf() > 0
                ))
                .map(([res, amt]) => (
                  <div key={res}>{res}: {amt}</div>
                ))}
            </div>
          );
        })}
      </div>

      {/* Meadow */}
      <section>
        <h2>Meadow</h2>
        <div style={{ display: 'flex', gap: '8px', overflowX: 'auto' }}>
          {game.meadow.map((card, index) => (
            <CardPreview key={index} card={card} />
          ))}
        </div>
      </section>

      {/* My City */}
      <section>
        <h2>My City</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {currentPlayer.city.map((card, index) => (
            <CardPreview key={index} card={card} />
          ))}
        </div>
      </section>

      {/* Hand */}
      <section>
        <h2>Hand</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {currentPlayer.hand.map((card, index) => (
            <CardPreview key={index} card={card} />
          ))}
        </div>
      </section>

      {/* Controls */}
      <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button onClick={() => drawCard(game.turn)}>Draw Card</button>
        <button onClick={() => endTurn()}>End Turn</button>
        <button onClick={() => addToMeadow()}>Add To Meadow</button>
      </div>
    </div>
  );
}

export default Game;
