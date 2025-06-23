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
import Navigation from "./Navigation";

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
        <div style={{ display: "flex", gap: "8px", flexDirection: "column" }}>
          <Navigation
            link="/lobby"
            displayText="Back to Lobby"
            arrow="backward"
          />
          <div style={idStyle}>{gameId}</div>
          <h3 style={{ margin: 0 }}>
            {game.turn}'s Turn{" "}
            {turnStatusText && (
              <span style={{ fontSize: "14px" }}>({turnStatusText})</span>
            )}
          </h3>
        </div>
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
      </div>
    </div>
  );
}

export default Sidebar;
