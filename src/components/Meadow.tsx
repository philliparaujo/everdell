import { useGame } from "../engine/GameContext";
import { scrollRowStyle } from "../screens/Game";
import CardPreview from "./CardPreview";

function Meadow() {
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
        const card = game.meadow[index] ?? null;

        return (
          <CardPreview
            key={index}
            index={index}
            card={card}
            placedDown={false}
            cityColor={null}
            onClick={() => {
              if (isDiscarding && card) {
                toggleCardDiscarding(game.turn, "meadow", index);
              } else if (isPlaying && card) {
                toggleCardPlaying(game.turn, "meadow", index);
              }
            }}
          />
        )
      })}
    </div>
  )
}

export default Meadow;