import { useGame } from "../engine/GameContext";
import { getPlayerId } from "../engine/helpers";
import CardRow from "./CardRow";

function Discard() {
  const {
    game,
    toggleCardPlaying
  } = useGame();

  const currentPlayer = game.players[game.turn];
  const isPlaying = currentPlayer.playing;

  const storedId = getPlayerId();

  return (
    <CardRow
      cards={game.discard}
      maxLength={game.discard.length}
      placedDown={false}
      cityColor={null}
      onLeftClick={(index, card) => {
        if (isPlaying && card) {
          toggleCardPlaying(storedId, "discard", index);
        }
      }}
    />
  )
}

export default Discard;