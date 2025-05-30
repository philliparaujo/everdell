import { useGame } from "../engine/GameContext";
import { PlayerColor } from "../engine/gameTypes";
import { scrollRowStyle } from "../screens/Game";
import CardPreview from "./CardPreview";

function City({ color }: { color: PlayerColor }) {
  const {
    game,
    toggleCardDiscarding,
  } = useGame();
  const currentPlayer = game.players[color];

  const isDiscarding = currentPlayer.discarding;

  return (
    <div style={scrollRowStyle}>
      {Array.from({ length: 15 }).map((_, index) => {
        const card = currentPlayer.city[index] ?? null;

        return (
          <CardPreview
            key={index}
            index={index}
            card={card}
            placedDown={true}
            cityColor={game.turn}
            onClick={() => {
              if (isDiscarding && card) {
                toggleCardDiscarding(game.turn, "city", index);
              }
            }}
          />
        )
      })}
    </div>
  )
}

export default City;