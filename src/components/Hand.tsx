import { useGame } from "../engine/GameContext";
import { scrollRowStyle } from "../screens/Game";
import CardPreview from "./CardPreview";

function Hand() {
  const {
    game,
    toggleCardDiscarding,
    toggleCardPlaying
  } = useGame();
  const currentPlayer = game.players[game.turn];

  const isDiscarding = currentPlayer.discarding;
  const isPlaying = currentPlayer.playing;

  return (
    <div style={scrollRowStyle}>
      {Array.from({ length: 8 }).map((_, index) => {
        const card = currentPlayer.hand[index] ?? null;

        return (
          <CardPreview
            key={index}
            index={index}
            card={card}
            placedDown={false}
            cityColor={null}
            onClick={() => {
              if (isDiscarding && card) {
                toggleCardDiscarding(game.turn, "hand", index);
              } else if (isPlaying && card) {
                toggleCardPlaying(game.turn, "hand", index);
              }
            }}
          />
        )
      })}
    </div>
  )
}

export default Hand;