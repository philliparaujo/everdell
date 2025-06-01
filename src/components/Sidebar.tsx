import { useGame } from "../engine/GameContext";
import { PlayerColor, ResourceType } from "../engine/gameTypes";
import { mapOverResources, maxCitySize } from "../engine/helpers";
import { sideBarStyling } from "../screens/Game";
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
      <div style={{ color: playerColor }}>
        <strong>{playerColor} - {player.name || 'Guest'}</strong>
        <p style={{ fontSize: '12px' }}>{player.id}</p>
      </div>
      <div>{player.season.toString()}</div>
      <div>Workers: {player.workers.workersLeft} / {player.workers.maxWorkers}</div>
      <div>Hand: {player.hand.length} / 8</div>
      <div>City: {player.city.length} / {maxCitySize(player.city)}</div>
      <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
        {mapOverResources(player.resources, (key, val) => (
          <div key={key}>
            <ResourceIcon type={key as ResourceType} /> {val}
          </div>
        ))}
      </div>
    </div>
  );
}

function Sidebar({ gameId }: { gameId: string | undefined }) {
  const {
    game
  } = useGame();

  return (
    <div style={sideBarStyling}>
      <div style={{ fontSize: '12px' }}>{gameId}</div>
      <h5>{game.turn} Turn</h5>
      <hr />
      <PlayerStatus playerColor={"Red"} />
      <hr />
      <PlayerStatus playerColor={"Blue"} />
      <hr />
      <Controls />
      <hr />
      <ResourceBank />
    </div>
  );
}

export default Sidebar;