import { MAX_HAND_SIZE } from "../engine/gameConstants";
import { useGame } from "../engine/GameContext";
import { PlayerColor } from "../engine/gameTypes";
import { getPlayerId } from "../engine/helpers";
import CardRow from "./CardRow";

function Hand({ color }: { color: PlayerColor }) {
  const {
    game,
    toggleCardDiscarding,
    toggleCardPlaying,
    toggleCardGiving
  } = useGame();
  const handOwner = game.players[color];
  const isDiscarding = handOwner.discarding;
  const isPlaying = handOwner.playing;
  const isGiving = handOwner.giving;

  const storedId = getPlayerId();

  return (
    <CardRow
      cards={handOwner.hand}
      maxLength={MAX_HAND_SIZE}
      placedDown={false}
      cityColor={null}
      onLeftClick={(index, card) => {
        if (isDiscarding && card) {
          toggleCardDiscarding(storedId, "hand", index);
        } else if (isPlaying && card) {
          toggleCardPlaying(storedId, "hand", index);
        } else if (isGiving && card) {
          toggleCardGiving(storedId, "hand", index);
        }
      }}
    />
  )
}

export default Hand;