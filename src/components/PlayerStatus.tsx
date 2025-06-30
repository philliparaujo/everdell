import { PLAYER_COLORS } from "../colors";
import { MAX_HAND_SIZE } from "../engine/gameConstants";
import { useGame } from "../engine/GameContext";
import { PlayerColor, ResourceType } from "../engine/gameTypes";
import {
  getPlayerId,
  mapOverResources,
  maxCitySize,
  seasonColor,
} from "../engine/helpers";
import { ResourceIcon, WorkerIcon } from "./Icons";
import Id from "./Id";

function PlayerStatus({ playerColor }: { playerColor: PlayerColor }) {
  const { game } = useGame();

  const storedId = getPlayerId();
  const player = game.players[playerColor];

  return (
    <div key={playerColor} className="flex flex-col gap-2">
      <div>
        <strong style={{ color: PLAYER_COLORS[playerColor] }}>
          {storedId === player.id ? "(Me) " : ""}
          {player.name || "Guest"}
        </strong>
        <Id id={player.id || "Not in game"} />
      </div>
      <div className="flex justify-between">
        <div>
          <div>
            <strong style={{ color: seasonColor(player.season) }}>
              {player.season}
            </strong>
          </div>
          <span className="flex items-center gap-1">
            <WorkerIcon playerColor={playerColor} />{" "}
            {player.workers.workersLeft} / {player.workers.maxWorkers}
          </span>
        </div>
        <div className="flex flex-col items-end">
          <div>
            Hand: {player.hand.length} / {MAX_HAND_SIZE}
          </div>
          <div>
            City: {player.city.length} / {maxCitySize(player.city)}
          </div>
        </div>
      </div>
      <div className="flex flex-row gap-2">
        {mapOverResources(
          player.resources,
          (key, val) => (
            <div key={key} className="flex items-center gap-1">
              <ResourceIcon type={key as ResourceType} /> {val}
            </div>
          ),
          true,
          () => (
            <div style={{ fontStyle: "italic" }}>No resources</div>
          ),
        )}
      </div>
    </div>
  );
}

export default PlayerStatus;
