import { useGame } from "../engine/GameContext";
import { defaultResources, PlayerColor, ResourceType } from "../engine/gameTypes";
import { ResourceIcon } from "./Icons";

export const resourceList: ResourceType[] = Object.entries(defaultResources).map(([key]) => key) as ResourceType[];

function ResourceDisplay({ playerColor, resource }: { playerColor: PlayerColor, resource: ResourceType }) {
  const {
    addResourcesToPlayer
  } = useGame();

  const decrementResources = () => {
    addResourcesToPlayer(playerColor, { ...defaultResources, [resource]: -1 })
  }
  const incrementResources = () => {
    addResourcesToPlayer(playerColor, { ...defaultResources, [resource]: 1 })
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
        <button onClick={decrementResources}>{"-"}</button>
        <button onClick={incrementResources}>{"+"}</button>
      </div>
    </div>
  );
}

function ResourceBank({ playerColor }: { playerColor: PlayerColor }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {resourceList
        .filter((key) => key !== "cards")
        .map((key) => (
          <ResourceDisplay key={key} playerColor={playerColor} resource={key as ResourceType} />
        ))}
    </div>
  );
}

export default ResourceBank;