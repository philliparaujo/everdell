import { useGame } from "../engine/GameContext";
import {
  getPlayerColor,
  getPlayerId,
  oppositePlayerOf,
} from "../engine/helpers";
import { idStyle, sideBarStyling } from "../screens/Game";
import Controls from "./Controls";
import Log from "./Log";
import PlayerStatus from "./PlayerStatus";
import ResourceBank from "./ResourceBank";
import Reveal from "./Reveal";

function Sidebar({ gameId }: { gameId: string | undefined }) {
  const { game } = useGame();

  const storedId = getPlayerId();
  const playerColor = getPlayerColor(game, storedId);
  const topStatusColor = playerColor ?? "Red";

  const currentPlayer = game.players[game.turn];
  let turnStatusText = "";
  if (currentPlayer.discarding) {
    turnStatusText = "Discarding...";
  } else if (currentPlayer.playing) {
    turnStatusText = "Playing...";
  } else if (currentPlayer.giving) {
    turnStatusText = "Giving...";
  }

  return (
    <div style={sideBarStyling}>
      <div style={{ padding: "8px" }}>
        <h3>
          {game.turn}'s Turn{" "}
          {turnStatusText && (
            <span style={{ fontSize: "14px" }}>({turnStatusText})</span>
          )}
        </h3>
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
        <Log playerColor={topStatusColor} />
        <hr />
        <div style={idStyle}>{gameId}</div>
      </div>
    </div>
  );
}

export default Sidebar;
