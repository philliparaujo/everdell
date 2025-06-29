import { COLORS } from "../colors";
import { useGame } from "../engine/GameContext";
import { defaultResources, ResourceType } from "../engine/gameTypes";
import {
  canGiveResources,
  getPlayerId,
  isNotYourTurn,
  mapOverResources,
  oppositePlayerOf,
} from "../engine/helpers";
import { resourceBankStyling } from "../screens/Game";
import Button from "./Button";
import { ResourceIcon } from "./Icons";

export const resourceDisplayStyling: React.CSSProperties = {
  width: "80px",
  height: "20px",
  background: COLORS.location,
  padding: "4px",
  borderRadius: "8px",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-around",
  alignItems: "center",
  textAlign: "center",
};

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
    <div style={resourceDisplayStyling}>
      <div>
        {canGiveResources(game.players[game.turn], game.specialEvents) && (
          <Button
            disabled={disabled}
            onClick={giveResource}
            color={COLORS.rareButton}
          >
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
    </div>
  );
}

function ResourceBank() {
  return (
    <div style={resourceBankStyling}>
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
