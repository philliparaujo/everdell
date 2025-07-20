import { useGame } from "../engine/GameContext";
import { getPlayerId } from "../utils/identity";
import CardRow from "./CardRow";

function FarmStack() {
  const { game, toggleCardPlaying } = useGame();
  const currentPlayer = game.players[game.turn];
  const isPlaying = currentPlayer.playing;

  const storedId = getPlayerId();

  return (
    <CardRow
      cards={game.farmStack}
      maxLength={1}
      location="farmStack"
      cityColor={null}
      onLeftClick={(index, card) => {
        if (isPlaying && card) {
          toggleCardPlaying(storedId, "farmStack", index, null);
        }
      }}
    />
  );
}

export default FarmStack;
