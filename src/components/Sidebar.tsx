import { useGame } from "../engine/GameContext";
import { getPlayerColor, getPlayerId, oppositePlayerOf } from "../engine/helpers";
import { headingStyling, idStyle, sideBarStyling } from "../screens/Game";
import Controls from "./Controls";
import PlayerStatus from "./PlayerStatus";
import ResourceBank from "./ResourceBank";
import Reveal from "./Reveal";

function Sidebar({ gameId }: { gameId: string | undefined }) {
  const {
    game
  } = useGame();

  const storedId = getPlayerId();
  const playerColor = getPlayerColor(game, storedId);
  const topStatusColor = playerColor ?? "Red";

  return (
    <div style={sideBarStyling}>
      <div style={{ padding: '8px' }}>
        <h3 style={{ ...headingStyling }}>{game.turn}'s Turn</h3>
        <hr />
        <PlayerStatus playerColor={topStatusColor} />
        <hr />
        <PlayerStatus playerColor={oppositePlayerOf(topStatusColor)} />
        <hr />
        <Controls />
        <hr />
        <p style={{ margin: 0 }}>{`Deck size: ${game.deck.length}`}</p>
        <ResourceBank />
        <Reveal />
        <hr />
        <div style={idStyle}>{gameId}</div>
      </div>
    </div>
  );
}

export default Sidebar;