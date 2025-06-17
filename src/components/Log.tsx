import { useGame } from "../engine/GameContext";
import { GameState, PlayerColor, ResourceType } from "../engine/gameTypes";
import { computeCardsDelta, computeResourceDelta, mapOverResources, oppositePlayerOf } from "../engine/helpers";
import { ResourceIcon, WorkerIcon } from "./Icons";

function PlayerLog({ previousTurn, color }: { previousTurn: GameState, color: PlayerColor }) {
  const {
    game
  } = useGame();

  const previousPlayer = previousTurn.players[color];
  const player = game.players[color];

  const seasonChange = player.season !== previousPlayer.season;
  const deltaResources = computeResourceDelta(previousPlayer.resources, player.resources);
  const deltaWorkers = player.workers.workersLeft - previousPlayer.workers.workersLeft;
  const deltaHand = computeCardsDelta(previousPlayer.hand, player.hand);
  const deltaCity = computeCardsDelta(previousPlayer.city, player.city);

  const hasHandChanges = deltaHand.added.length > 0 || deltaHand.removed.length > 0;
  const hasCityChanges = deltaCity.added.length > 0 || deltaCity.removed.length > 0;

  return (
    <div>
      {color}
      {": "}

      {/* Harvest */}
      {seasonChange && (<div>
        {`Harvest to ${player.season}`}
      </div>)}

      {/* Workers */}
      {deltaWorkers !== 0 && (<div>
        <span><WorkerIcon playerColor={color} /> {deltaWorkers}</span> {/* Assuming WorkerIcon exists */}
      </div>)}

      {/* Resources */}
      <div style={{ display: 'flex', flexDirection: 'row', gap: '8px' }}>
        {mapOverResources(deltaResources, (key, val) => (
          <div key={key}>
            <ResourceIcon type={key as ResourceType} /> {val}
          </div>
        ), true)}
      </div>

      {/* Hand */}
      {hasHandChanges && (
        <div>
          <span>Hand: </span>
          {deltaHand.added.length > 0 && (
            <span>
              Added: {deltaHand.added.join(', ')}
              {deltaHand.removed.length > 0 && '; '}
            </span>
          )}
          {deltaHand.removed.length > 0 && (
            <span>
              Removed: {deltaHand.removed.join(', ')}
            </span>
          )}
        </div>
      )}

      {/* City */}
      {hasCityChanges && (
        <div>
          <span>City: </span>
          {deltaCity.added.length > 0 && (
            <span>
              Added: {deltaCity.added.join(', ')}
              {deltaCity.removed.length > 0 && '; '}
            </span>
          )}
          {deltaCity.removed.length > 0 && (
            <span>
              Removed: {deltaCity.removed.join(', ')}
            </span>
          )}
        </div>
      )}

    </div>
  );
}

function Log({ playerColor }: { playerColor: PlayerColor }) {
  const {
    gameLog
  } = useGame();

  return (
    <div>
      <PlayerLog previousTurn={gameLog.state} color={playerColor} />
      <br />
      <PlayerLog previousTurn={gameLog.state} color={oppositePlayerOf(playerColor)} />
    </div>
  )
}

export default Log;
