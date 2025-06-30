import { useGame } from "../engine/GameContext";
import {
  getPlayerColor,
  getPlayerId,
  oppositePlayerOf,
} from "../engine/helpers";
import Controls from "./Controls";
import Log from "./Log";
import PlayerStatus from "./PlayerStatus";
import ResourceBank from "./ResourceBank";
import Reveal from "./Reveal";
import Navigation from "./Navigation";
import Id from "./Id";
import { COLORS } from "../colors";

export const SIDEBAR_WIDTH = "260px";

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
    <div
      className="h-screen overflow-y-auto overflow-x-hidden fixed border-r"
      style={{
        background: COLORS.container,
        borderRightColor: COLORS.containerBorder,
        width: SIDEBAR_WIDTH,
      }}
    >
      <div className="p-2 flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Navigation
            link="/lobby"
            displayText="Back to Lobby"
            arrow="backward"
          />
          <Id id={gameId ?? ""} />
          <h3 className="font-bold text-lg">
            {game.turn}'s Turn{" "}
            {turnStatusText && (
              <span className="text-sm">({turnStatusText})</span>
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
        <p>{`Deck size: ${game.deck.length}`}</p>
        <ResourceBank />
        <Reveal />
        <hr />
        <Log playerColor={topStatusColor} />
      </div>
    </div>
  );
}

export default Sidebar;
