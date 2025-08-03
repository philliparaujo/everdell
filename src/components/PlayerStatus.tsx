import { useGame } from "../engine/GameContext";
import { PlayerColor, ResourceType } from "../engine/gameTypes";
import { computeMaxCitySize, computeMaxHandSize } from "../utils/gameLogic";
import { getPlayerId } from "../utils/identity";
import { mapOverResources } from "../utils/loops";
import { stylePlayerColor, styleSeasonColor } from "../utils/tailwind";
import Hoverable from "./Hoverable";
import { ResourceIcon, WorkerIcon } from "./Icons";
import Id from "./Id";
import PowerInspect from "./PowerInspect";

function PlayerStatus({ playerColor }: { playerColor: PlayerColor }) {
  const { game } = useGame();

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
            <div className="flex gap-2 text-xs">
              <strong>Power: </strong>
              {player.power ? (
                <Hoverable
                  isInteractive={true}
                  onRightClick={(closeInspector) => (
                    <PowerInspect
                      power={player.power!!}
                      onClose={closeInspector}
                      inGame={true}
                    />
                  )}
                >
                  <div className="flex">
                    {player.power.name}
                    {player.power.storage &&
                      mapOverResources(player.power.storage, (key, val) => (
                        <div
                          key={key}
                          className="flex items-center text-[10px]"
                        >
                          <ResourceIcon type={key as ResourceType} /> {val}
                        </div>
                      ))}
                  </div>
                </Hoverable>
              ) : (
                "None"
              )}
            </div>
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
            Hand: {player.hand.length} / {computeMaxHandSize(game, playerColor)}
          </div>
          <div>
            City: {player.city.length - cardsUnderDungeon} /{" "}
            {computeMaxCitySize(player.city, player.power) - cardsUnderDungeon}
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
