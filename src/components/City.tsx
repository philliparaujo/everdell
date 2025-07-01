import { useGame } from "../engine/GameContext";
import { PlayerColor } from "../engine/gameTypes";
import { getPlayerId } from "../utils/identity";
import CardRow from "./CardRow";

function City({ color }: { color: PlayerColor }) {
  const { game, toggleCardDiscarding } = useGame();
  const cityOwner = game.players[color];
  const isDiscarding = cityOwner.discarding;

  const storedId = getPlayerId();

  return (
    <CardRow
      cards={cityOwner.city}
      placedDown={true}
      cityColor={color}
      onLeftClick={(index, card) => {
        if (isDiscarding && card) {
          toggleCardDiscarding(storedId, "city", index);
        }
      }}
    />
  );
}

export default City;
