import { COLORS } from "../colors";
import { useGame } from "../engine/GameContext";
import { defaultResources, ResourceType } from "../engine/gameTypes";
import {
  getPlayerId,
  isNotYourTurn,
  mapOverResources,
} from "../engine/helpers";
import { resourceBankStyling } from "../screens/Game";
import Button from "./Button";
import { ResourceIcon } from "./Icons";

export const resourceDisplayStyling: React.CSSProperties = {
  width: "70px",
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
  const { game, addResourcesToSelf } = useGame();

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

  const decrementResources = () => {
    addResourcesToSelf(storedId, { ...defaultResources, [resource]: -1 });
  };
  const incrementResources = () => {
    addResourcesToSelf(storedId, { ...defaultResources, [resource]: 1 });
  };

  return (
    <div style={resourceDisplayStyling}>
      <div>
        <ResourceIcon type={resource} />
        <Button disabled={disabled} onClick={decrementResources}>
          {"-"}
        </Button>
        <Button disabled={disabled} onClick={incrementResources}>
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
