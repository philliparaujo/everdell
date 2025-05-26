import { useGame } from "../engine/GameContext";
import { defaultResources, PlayerColor, ResourceType } from "../engine/gameTypes";
import { ResourceIcon } from "./ResourceIcon";

function ResourceDisplay({ playerColor, resource }: { playerColor: PlayerColor, resource: ResourceType }) {
  const {
    addResourcesToPlayer
  } = useGame();

  const decrementResources = () => {
    const emptyResources = { ...defaultResources };
    addResourcesToPlayer(playerColor, { ...emptyResources, [resource]: -1 })
  }
  const incrementResources = () => {
    const emptyResources = { ...defaultResources };
    addResourcesToPlayer(playerColor, { ...emptyResources, [resource]: 1 })
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
  const {
    game
  } = useGame();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
      {Object.entries(game.players[playerColor].resources)
        .filter(([key, val]) => key !== "cards")
        .map(([key, val], _) => (
          <ResourceDisplay key={key} playerColor={playerColor} resource={key as ResourceType} />
        ))}
    </div>
  );
}

export default ResourceBank;