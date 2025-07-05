import { useGame } from "../engine/GameContext";
import { isNotYourTurn, oppositePlayerOf } from "../utils/gameLogic";
import { getPlayerColor, getPlayerId } from "../utils/identity";
import { LOBBY_PATH } from "../utils/navigation";
import { renderActiveExpansions } from "../utils/react";
import Button from "./Button";
import Controls from "./Controls";
import Id from "./Id";
import Log from "./Log";
import Navigation from "./Navigation";
import PlayerStatus from "./PlayerStatus";
import ResourceBank from "./ResourceBank";
import Reveal from "./Reveal";

function Sidebar({ gameId }: { gameId: string | undefined }) {
  const { game, resetTurn } = useGame();

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);
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
          link={LOBBY_PATH}
          displayText="Back to Lobby"
          arrow="backward"
        />
        <Id id={gameId ?? ""} />
        {renderActiveExpansions(game.activeExpansions)}
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
      <hr />
      <div className="grid grid-cols-2 gap-2 max-w-400px">
        <Button
          disabled={disabled}
          variant="danger"
          onClick={() => resetTurn(storedId)}
        >
          Reset Turn
        </Button>
      </div>
    </div>
  );
}

export default Sidebar;
