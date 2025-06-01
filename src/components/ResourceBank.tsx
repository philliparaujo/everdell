import { useGame } from "../engine/GameContext";
import { defaultResources, ResourceType } from "../engine/gameTypes";
import { getPlayerId, isNotYourTurn, mapOverResources } from "../engine/helpers";
import { resourceBankStyling } from "../screens/Game";
import { ResourceIcon } from "./Icons";


function ResourceDisplay({ resource }: { resource: ResourceType }) {
  const {
    game,
    addResourcesToSelf
  } = useGame();

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

  const decrementResources = () => {
    addResourcesToSelf(storedId, { ...defaultResources, [resource]: -1 })
  }
  const incrementResources = () => {
    addResourcesToSelf(storedId, { ...defaultResources, [resource]: 1 })
  }

  return (
    <div
      style={{
        width: '70px',
        height: '20px',
        background: '#DCBA9E',
        padding: '4px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        textAlign: 'center'
      }}
    >
      <div>
        <ResourceIcon type={resource} />
        <button disabled={disabled} onClick={decrementResources}>{"-"}</button>
        <button disabled={disabled} onClick={incrementResources}>{"+"}</button>
      </div>
    </div>
  );
}

function ResourceBank() {
  return (
    <div style={resourceBankStyling}>
      {mapOverResources(defaultResources, (key, _) => {
        return (
          key === "cards" ?
            (<></>) :
            (<ResourceDisplay key={key} resource={key} />)
        )
      }, false)}
    </div>
  );
}

export default ResourceBank;