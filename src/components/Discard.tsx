import { useGame } from "../engine/GameContext";
import { getPlayerId } from "../utils/identity";
import CardRow from "./CardRow";

function Discard() {
  const { game, toggleCardPlaying } = useGame();

  const currentPlayer = game.players[game.turn];
  const isPlaying = currentPlayer.playing;

  const storedId = getPlayerId();

  if (game.discard.length === 0) {
    return (
      <div className="italic text-center py-2">No cards in discard pile</div>
    );
  }

  return (
    <CardRow
      cards={game.discard}
      maxLength={game.discard.length}
      location="discard"
      cityColor={null}
      onLeftClick={(index, card) => {
        if (isPlaying && card) {
          toggleCardPlaying(storedId, "discard", index, null);
        }
      }}
    />
  );
}

export default Discard;
