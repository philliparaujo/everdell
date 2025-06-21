import { PLAYER_COLORS } from "../colors";
import { useGame } from "../engine/GameContext";
import { Card, History, PlayerColor, ResourceType } from "../engine/gameTypes";
import { computeResourceDelta, mapOverResources, oppositePlayerOf, seasonColor } from "../engine/helpers";
import { ResourceIcon, WorkerIcon } from "./Icons";

/**
 * A single, styled entry in a player's log.
 */
function LogEntry({ children }: { children: React.ReactNode }) {
  return (
    <li style={{ marginBottom: '5px', listStyleType: 'none', listStylePosition: 'inside' }}>
      {children}
    </li>
  );
}

/**
 * Displays the turn summary for a single player.
 */
function PlayerLog({ history, color }: { history: History, color: PlayerColor }) {
  const { game } = useGame();
  const player = game.players[color];

  const seasonChange = player.season !== history.season;
  const deltaResources = computeResourceDelta(history.resources, player.resources);
  const deltaWorkers = player.workers.workersLeft - history.workers.workersLeft;

  // Publicly reveals card names for actions visible to all players.
  const publicCardList = (cards: Card[]): string => {
    return cards.map(c => c.name).join(', ');
  };

  const hasContent =
    history.played?.length > 0 ||
    history.drew?.length > 0 ||
    history.gave?.length > 0 ||
    history.discarded?.length > 0 ||
    history.cityDiscarded?.length > 0 ||
    seasonChange ||
    deltaWorkers !== 0 ||
    Object.values(deltaResources).some(v => v !== 0);

  return (
    <div style={{ fontSize: '0.9em' }}>
      <strong style={{ color: PLAYER_COLORS[color] }}>
        {color}
      </strong>
      <ul style={{ margin: '8px 0 0 5px', padding: 0 }}>
        {seasonChange && (
          <LogEntry>
            Advanced to <strong style={{ color: seasonColor(player.season) }}>{player.season}</strong>
          </LogEntry>
        )}

        {history.played?.length > 0 && (
          <LogEntry>
            <strong>Played:</strong> {publicCardList(history.played)}
          </LogEntry>
        )}
        {history.cityDiscarded?.length > 0 && (
          <LogEntry>
            <strong>City discarded:</strong> {publicCardList(history.cityDiscarded)}
          </LogEntry>
        )}
        {history.gave?.length > 0 && (
          <LogEntry>
            <strong>Gave:</strong> {publicCardList(history.gave)}
          </LogEntry>
        )}
        {history.drew?.length > 0 && (
          <LogEntry>
            <strong>Drew:</strong> {history.drew.length} card{history.drew.length !== 1 ? 's' : ''}
          </LogEntry>
        )}
        {history.discarded?.length > 0 && (
          <LogEntry>
            <strong>Discarded:</strong> {history.discarded.length} card{history.discarded.length !== 1 ? 's' : ''}
          </LogEntry>
        )}

        {deltaWorkers !== 0 && (
          <LogEntry>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <WorkerIcon playerColor={color} /> {deltaWorkers > 0 ? '+' : ''}{deltaWorkers}
            </span>
          </LogEntry>
        )}
        {Object.values(deltaResources).some(v => v !== 0) && (
          <LogEntry>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '8px' }}>
              {mapOverResources(deltaResources, (key, val) => (
                <div key={key} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ResourceIcon type={key as ResourceType} /> {val > 0 ? '+' : ''}{val}
                </div>
              ), true)}
            </div>
          </LogEntry>
        )}
        {!hasContent && (
          <div style={{ fontStyle: 'italic' }}>No actions made</div>
        )}
      </ul>
    </div>
  );
}

function Log({ playerColor }: { playerColor: PlayerColor }) {
  const {
    game
  } = useGame();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <strong>Turn Log</strong>
      <PlayerLog history={game.players[playerColor].history} color={playerColor} />
      <PlayerLog history={game.players[oppositePlayerOf(playerColor)].history} color={oppositePlayerOf(playerColor)} />
    </div>
  )
}

export default Log;
