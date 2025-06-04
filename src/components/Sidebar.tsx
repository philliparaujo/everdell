import { useGame } from "../engine/GameContext";
import { headingStyling, idStyle, sideBarStyling } from "../screens/Game";
import Controls from "./Controls";
import PlayerStatus from "./PlayerStatus";
import ResourceBank from "./ResourceBank";
import Reveal from "./Reveal";

function Sidebar({ gameId }: { gameId: string | undefined }) {
  const {
    game
  } = useGame();

  return (
    <div style={sideBarStyling}>
      <div style={{ padding: '8px' }}>
        <h3 style={{ ...headingStyling }}>{game.turn}'s Turn</h3>
        <hr />
        <PlayerStatus playerColor={"Red"} />
        <hr />
        <PlayerStatus playerColor={"Blue"} />
        <hr />
        <Controls />
        <hr />
        <p style={{ margin: 0 }}>{`Deck size: ${game.deck.length}`}</p>
        <ResourceBank />
        <hr />
        <Reveal />
        <hr />
        <div style={idStyle}>{gameId}</div>
      </div>
    </div>
  );
}

export default Sidebar;