import { useGame } from "../engine/GameContext";
import { PlayerColor } from "../engine/gameTypes";
import { getPlayerId } from "../engine/helpers";
import CardRow from "./CardRow";

function Hand({ color }: { color: PlayerColor }) {
  const {
    game,
    toggleCardDiscarding,
    toggleCardPlaying
  } = useGame();
  const handOwner = game.players[color];
  const isDiscarding = handOwner.discarding;
  const isPlaying = handOwner.playing;

  const storedId = getPlayerId();

  return (
    <CardRow
      cards={handOwner.hand}
      maxLength={8}
      placedDown={false}
      cityColor={null}
      onLeftClick={(index, card) => {
        if (isDiscarding && card) {
          toggleCardDiscarding(storedId, "hand", index);
        } else if (isPlaying && card) {
          toggleCardPlaying(storedId, "hand", index);
        }
      }}
    />
  )
}

export default Hand;