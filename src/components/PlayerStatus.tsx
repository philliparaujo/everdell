import { MAX_HAND_SIZE } from "../engine/gameConstants";
import { useGame } from "../engine/GameContext";
import { PlayerColor, ResourceType } from "../engine/gameTypes";
import { computeMaxCitySize, isNotYourTurn } from "../utils/gameLogic";
import { getPlayerId } from "../utils/identity";
import { mapOverResources } from "../utils/loops";
import { stylePlayerColor, styleSeasonColor } from "../utils/tailwind";
import Button from "./Button";
import { ResourceIcon, WorkerIcon } from "./Icons";
import Id from "./Id";

function PlayerStatus({ playerColor }: { playerColor: PlayerColor }) {
  const { game, nextPower } = useGame();

  const storedId = getPlayerId();
  const player = game.players[playerColor];

  const cardsUnderDungeon = player.city.reduce(
    (acc, curr) => acc + (curr.below === "Dungeon" ? 1 : 0),
    0,
  );

  return (
    <div key={playerColor} className="flex flex-col gap-2">
      <div>
        <strong className={`${stylePlayerColor(playerColor)}`}>
          {storedId === player.id ? "(Me) " : ""}
          {player.name || "Guest"}
        </strong>
        <Id id={player.id || "Not in game"} />
        {game.powersEnabled && (
          <>
            <div className="text-xs">
              <strong>Power: </strong> {player.power?.name ?? "None"}
            </div>
            <Button
              disabled={isNotYourTurn(game, storedId)}
              onClick={() => nextPower(storedId, -1)}
            >
              Prev power
            </Button>
            <Button
              disabled={isNotYourTurn(game, storedId)}
              onClick={() => nextPower(storedId, 1)}
            >
              Next power
            </Button>
          </>
        )}
      </div>
      <div className="flex justify-between">
        <div>
          <div>
            <strong className={`${styleSeasonColor(player.season)}`}>
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
            City: {player.city.length - cardsUnderDungeon} /{" "}
            {computeMaxCitySize(player.city) - cardsUnderDungeon}
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
            <div className="italic">No resources</div>
          ),
        )}
      </div>
    </div>
  );
}

export default PlayerStatus;
