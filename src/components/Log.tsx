import { useGame } from "../engine/GameContext";
import { Card, History, PlayerColor, ResourceType } from "../engine/gameTypes";
import { computeResourceDelta, mapOverResources, oppositePlayerOf } from "../engine/helpers";
import { ResourceIcon, WorkerIcon } from "./Icons";

function PlayerLog({ history, color }: { history: History, color: PlayerColor }) {
  const {
    game
  } = useGame();

  const player = game.players[color];

  const seasonChange = player.season !== history.season;
  const deltaResources = computeResourceDelta(history.resources, player.resources);
  const deltaWorkers = player.workers.workersLeft - history.workers.workersLeft;

  // Helper to create a comma-separated list of card names
  const cardList = (cards: Card[]): string => {
    return cards.map(c => c.name).join(', ');
  }

  return (
    <div>
      {color}
      {": "}

      {/* --- Card Actions --- */}
      {history.played?.length > 0 && (
        <div>
          Played: {cardList(history.played)}
        </div>
      )}
      {history.drew?.length > 0 && (
        <div>
          Drew: {cardList(history.drew)}
        </div>
      )}
      {history.gave?.length > 0 && (
        <div>
          Gave: {cardList(history.gave)}
        </div>
      )}
      {history.discarded?.length > 0 && (
        <div>
          Discarded: {cardList(history.discarded)}
        </div>
      )}
      {history.cityDiscarded?.length > 0 && (
        <div>
          Discarded from city: {cardList(history.cityDiscarded)}
        </div>
      )}

      {/* --- Other Turn Events --- */}
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
    </div>
  );
}

function Log({ playerColor }: { playerColor: PlayerColor }) {
  const {
    game
  } = useGame();

  return (
    <div>
      <PlayerLog history={game.players[playerColor].history} color={playerColor} />
      <br />
      <PlayerLog history={game.players[oppositePlayerOf(playerColor)].history} color={oppositePlayerOf(playerColor)} />
    </div>
  )
}

export default Log;
