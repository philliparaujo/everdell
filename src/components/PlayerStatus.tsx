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
import { headingStyling, idStyle } from "../screens/Game";
import { ResourceIcon, WorkerIcon } from "./Icons";

function PlayerStatus({ playerColor }: { playerColor: PlayerColor }) {
  const { game } = useGame();

  const storedId = getPlayerId();
  const player = game.players[playerColor];

  return (
    <div key={playerColor}>
      <div>
        <strong style={{ color: PLAYER_COLORS[playerColor] }}>
          {storedId === player.id ? "(Me) " : ""}
          {player.name || "Guest"}
        </strong>
        <p style={{ ...headingStyling, ...idStyle, marginBottom: "8px" }}>
          {player.id !== "" ? player.id : "Not in game"}
        </p>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "12px",
        }}
      >
        <div>
          <div>
            <strong style={{ color: seasonColor(player.season) }}>
              {player.season}
            </strong>
          </div>
          <span>
            <WorkerIcon playerColor={playerColor} />{" "}
            {player.workers.workersLeft} / {player.workers.maxWorkers}
          </span>
        </div>
        <div>
          <div>
            Hand: {player.hand.length} / {MAX_HAND_SIZE}
          </div>
          <div>
            City: {player.city.length} / {maxCitySize(player.city)}
          </div>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
        {mapOverResources(
          player.resources,
          (key, val) => (
            <div key={key}>
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
