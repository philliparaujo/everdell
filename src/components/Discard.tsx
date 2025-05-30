import { useGame } from "../engine/GameContext";
import { scrollRowStyle } from "../screens/Game";
import CardPreview from "./CardPreview";

function Discard() {
  const {
    game,
    toggleCardPlaying
  } = useGame();

  const currentPlayer = game.players[game.turn];
  const isPlaying = currentPlayer.playing;

  return (
    <div style={scrollRowStyle}>
      {game.discard.map((card, index) => {
        return (
          <CardPreview
            key={index}
            index={index}
            card={card}
            placedDown={false}
            cityColor={null}
            onClick={() => {
              if (isPlaying && card) {
                toggleCardPlaying(game.turn, "discard", index);
              }
            }}
          />
        )
      })}
    </div>
  )
}

export default Discard;