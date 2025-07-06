import { MAX_LEGENDS_SIZE } from "../engine/gameConstants";
import { useGame } from "../engine/GameContext";
import { PlayerColor } from "../engine/gameTypes";
import { getPlayerId } from "../utils/identity";
import CardRow from "./CardRow";

function Legends({ color }: { color: PlayerColor }) {
  const { game, toggleCardPlaying } = useGame();
  const legendsOwner = game.players[color];
  const isPlaying = legendsOwner.playing;

  const storedId = getPlayerId();

  return (
    <CardRow
      cards={legendsOwner.legends}
      maxLength={MAX_LEGENDS_SIZE}
      location="legends"
      cityColor={color}
      onLeftClick={(index, card) => {
        if (isPlaying && card) {
          toggleCardPlaying(storedId, "legends", index);
        }
      }}
    />
  );
}

export default Legends;
