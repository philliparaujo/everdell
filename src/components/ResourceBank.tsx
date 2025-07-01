import { useGame } from "../engine/GameContext";
import { defaultResources } from "../engine/gameDefaults";
import { ResourceType } from "../engine/gameTypes";
import {
  canGiveResources,
  isNotYourTurn,
  oppositePlayerOf,
} from "../utils/gameLogic";
import { getPlayerId } from "../utils/identity";
import { mapOverResources } from "../utils/loops";
import Button from "./Button";
import { ResourceIcon } from "./Icons";

export function ResourceDisplay({ resource }: { resource: ResourceType }) {
  const { game, addResourcesToSelf, giveResources } = useGame();

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

  const decrementResource = () => {
    addResourcesToSelf(storedId, { ...defaultResources, [resource]: -1 });
  };
  const incrementResource = () => {
    addResourcesToSelf(storedId, { ...defaultResources, [resource]: 1 });
  };
  const giveResource = () => {
    giveResources(
      storedId,
      { ...defaultResources, [resource]: 1 },
      oppositePlayerOf(game.turn),
    );
  };

  return (
    <div className="flex items-center justify-center gap-1">
      {canGiveResources(game.players[game.turn], game.specialEvents) && (
        <Button disabled={disabled} onClick={giveResource} variant="rare">
          {"!"}
        </Button>
      )}
      <ResourceIcon type={resource} />
      <Button disabled={disabled} onClick={decrementResource}>
        {"-"}
      </Button>
      <Button disabled={disabled} onClick={incrementResource}>
        {"+"}
      </Button>
    </div>
  );
}

function ResourceBank() {
  return (
    <div className="grid grid-cols-2 gap-2">
      {mapOverResources(
        defaultResources,
        (key, _) => {
          return key === "cards" ? (
            <></>
          ) : (
            <ResourceDisplay key={key} resource={key} />
          );
        },
        false,
      )}
    </div>
  );
}

export default ResourceBank;
