import { useGame } from "../engine/GameContext";
import { oppositePlayerOf } from "../utils/gameLogic";
import { getPlayerColor, getPlayerId } from "../utils/identity";
import Controls from "./Controls";
import Id from "./Id";
import Log from "./Log";
import Navigation from "./Navigation";
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
    <div className="w-sidebar h-screen overflow-y-auto overflow-x-hidden fixed border-r bg-container border-container-border p-2 flex flex-col gap-1">
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
  );
}

export default Sidebar;
