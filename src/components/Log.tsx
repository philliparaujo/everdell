import { COLORS, PLAYER_COLORS } from "../colors";
import { useGame } from "../engine/GameContext";
import { Card, History, PlayerColor, ResourceType } from "../engine/gameTypes";
import {
  computeResourceDelta,
  listCardNames,
  mapOverResources,
  oppositePlayerOf,
  seasonColor,
} from "../engine/helpers";
import { ResourceIcon, WorkerIcon } from "./Icons";

function LogEntry({ children }: { children: React.ReactNode }) {
  return <li className="mb-1 list-none list-inside">{children}</li>;
}

function PlayerLog({
  history,
  color,
}: {
  history: History;
  color: PlayerColor;
}) {
  const { game } = useGame();
  const player = game.players[color];

  const seasonChange = player.season !== history.season;
  const deltaResources = computeResourceDelta(
    history.resources,
    player.resources,
  );
  const deltaWorkers = player.workers.workersLeft - history.workers.workersLeft;

  const listCards = (cards: Card[]): string => {
    return listCardNames(cards.map((c) => c.name));
  };

  const hasContent =
    history.played?.length > 0 ||
    history.drew?.length > 0 ||
    history.gave?.length > 0 ||
    history.discarded?.length > 0 ||
    history.cityDiscarded?.length > 0 ||
    seasonChange ||
    deltaWorkers !== 0 ||
    Object.values(deltaResources).some((v) => v !== 0);

  if (!player.name) return null;

  return (
    <div className="text-sm p-2">
      <strong style={{ color: PLAYER_COLORS[color] }}>{player.name}</strong>
      <ul className="mt-2 ml-1 p-0">
        {seasonChange && (
          <LogEntry>
            Advanced to{" "}
            <strong style={{ color: seasonColor(player.season) }}>
              {player.season}
            </strong>
          </LogEntry>
        )}
        {history.played?.length > 0 && (
          <LogEntry>
            <strong>Played:</strong> {listCards(history.played)}
          </LogEntry>
        )}
        {history.cityDiscarded?.length > 0 && (
          <LogEntry>
            <strong>City discarded:</strong> {listCards(history.cityDiscarded)}
          </LogEntry>
        )}
        {history.gave?.length > 0 && (
          <LogEntry>
            <strong>Gave:</strong> {listCards(history.gave)}
          </LogEntry>
        )}
        {history.drew?.length > 0 && (
          <LogEntry>
            <strong>Drew:</strong> {history.drew.length} card
            {history.drew.length !== 1 ? "s" : ""}
          </LogEntry>
        )}
        {history.discarded?.length > 0 && (
          <LogEntry>
            <strong>Discarded:</strong> {history.discarded.length} card
            {history.discarded.length !== 1 ? "s" : ""}
          </LogEntry>
        )}
        {deltaWorkers !== 0 && (
          <LogEntry>
            <span className="flex items-center gap-1">
              <WorkerIcon playerColor={color} /> {deltaWorkers > 0 ? "+" : ""}
              {deltaWorkers}
            </span>
          </LogEntry>
        )}
        {Object.values(deltaResources).some((v) => v !== 0) && (
          <LogEntry>
            <div className="flex flex-row items-center gap-2">
              {mapOverResources(
                deltaResources,
                (key, val) => (
                  <div key={key} className="flex items-center gap-1">
                    <ResourceIcon type={key as ResourceType} />{" "}
                    {val > 0 ? "+" : ""}
                    {val}
                  </div>
                ),
                true,
              )}
            </div>
          </LogEntry>
        )}
        {!hasContent && <div className="italic">No actions made</div>}
      </ul>
    </div>
  );
}

function Log({ playerColor }: { playerColor: PlayerColor }) {
  const { game } = useGame();

  return (
    <div
      className="flex flex-col gap-1 rounded-s"
      style={{
        backgroundColor: COLORS.log,
      }}
    >
      <PlayerLog
        history={game.players[playerColor].history}
        color={playerColor}
      />
      <PlayerLog
        history={game.players[oppositePlayerOf(playerColor)].history}
        color={oppositePlayerOf(playerColor)}
      />
    </div>
  );
}

export default Log;
