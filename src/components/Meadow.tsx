import { useGame } from "../engine/GameContext";
import { getPlayerId } from "../engine/helpers";
import CardRow from "./CardRow";

function Meadow() {
  const {
    game,
    toggleCardDiscarding,
    toggleCardPlaying
  } = useGame();
  const currentPlayer = game.players[game.turn];
  const isDiscarding = currentPlayer.discarding;
  const isPlaying = currentPlayer.playing;

  const storedId = getPlayerId();

  return (
    <CardRow
      cards={game.meadow}
      maxLength={8}
      placedDown={false}
      cityColor={null}
      onLeftClick={(index, card) => {
        if (isDiscarding && card) {
          toggleCardDiscarding(storedId, "meadow", index);
        } else if (isPlaying && card) {
          toggleCardPlaying(storedId, "meadow", index);
        }
      }}
    />
  )
}

export default Meadow;