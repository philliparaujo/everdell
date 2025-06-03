import { MAX_MEADOW_SIZE } from "../engine/gameConstants";
import { useGame } from "../engine/GameContext";
import { getPlayerId } from "../engine/helpers";
import CardRow from "./CardRow";

function Meadow() {
  const {
    game,
    toggleCardDiscarding,
    toggleCardPlaying,
    toggleCardGiving
  } = useGame();
  const currentPlayer = game.players[game.turn];
  const isDiscarding = currentPlayer.discarding;
  const isPlaying = currentPlayer.playing;
  const isGiving = currentPlayer.giving;

  const storedId = getPlayerId();

  return (
    <CardRow
      cards={game.meadow}
      maxLength={MAX_MEADOW_SIZE}
      placedDown={false}
      cityColor={null}
      onLeftClick={(index, card) => {
        if (isDiscarding && card) {
          toggleCardDiscarding(storedId, "meadow", index);
        } else if (isPlaying && card) {
          toggleCardPlaying(storedId, "meadow", index);
        } else if (isGiving && card) {
          toggleCardGiving(storedId, "meadow", index);
        }
      }}
    />
  )
}

export default Meadow;