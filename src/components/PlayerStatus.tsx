import { useGame } from "../engine/GameContext";
import { PlayerColor, ResourceType } from "../engine/gameTypes";
import Controls from "./Controls";
import { ResourceIcon } from "./Icons";
import ResourceBank from "./ResourceBank";

function PlayerStatus({ playerColor }: { playerColor: PlayerColor }) {
  const {
    game
  } = useGame();

  const player = game.players[playerColor];
  return (
    <div key={playerColor} style={{ marginBottom: '12px' }}>
      <strong>{playerColor} - {player.name || 'Username'}</strong>
      <div>{player.season.toString()}</div>
      <div>Workers: {player.workers.workersLeft} / {player.workers.maxWorkers}</div>
      <div>Hand: {player.hand.length} / 8</div>
      <div>City: {player.city.length} / 15</div>
      {Object.entries(player.resources)
        .filter(([, val]) => (
          val.valueOf() > 0
        ))
        .map(([key, val]) => (
          <div key={key}>
            <ResourceIcon type={key as ResourceType} /> {val}
          </div>
        ))}
    </div>
  );
}

function PlayerStatuses() {
  const {
    game
  } = useGame();

  return (
    <div style={{
      position: 'absolute',
      display: 'flex',
      top: 16,
      right: 16,
      background: '#DCBA9E',
      border: '1px solid #ccc',
      borderRadius: '8px',
      padding: '12px',
      gap: '40px',
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-start' }}>
        <Controls />
        <hr />
        <ResourceBank playerColor={game.turn} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <h5>MY TURN</h5>
        <PlayerStatus playerColor={"Red"} />
        <hr />
        <PlayerStatus playerColor={"Blue"} />
      </div>
    </div>
  );
}


export default PlayerStatuses;