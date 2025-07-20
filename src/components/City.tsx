import { useGame } from "../engine/GameContext";
import { Card, PlayerColor } from "../engine/gameTypes";
import { canStealCard, oppositePlayerOf } from "../utils/gameLogic";
import { getPlayerId } from "../utils/identity";
import CardRow from "./CardRow";

function City({ color }: { color: PlayerColor }) {
  const { game, toggleCardDiscarding, toggleCardPlaying, playCard } = useGame();
  const cityOwner = game.players[color];
  const isDiscarding = cityOwner.discarding;

  const storedId = getPlayerId();

  const opponentCanSteal = canStealCard(game, game.turn);
  const opponentIsPlaying = game.players[oppositePlayerOf(color)].playing;

  const handleDrop = (
    droppedCard: Card,
    sourceLocation: string,
    sourceIndex: number,
    targetIndex: number,
  ) => {
    // Only allow playing cards if it's the player's turn and they're not discarding
    if (game.turn === color && !isDiscarding) {
      // Validate the source location is playable
      if (
        sourceLocation === "hand" ||
        sourceLocation === "meadow" ||
        sourceLocation === "discard" ||
        sourceLocation === "reveal" ||
        sourceLocation === "farmStack" ||
        sourceLocation === "legends"
      ) {
        playCard(
          storedId,
          sourceLocation as
            | "hand"
            | "meadow"
            | "discard"
            | "reveal"
            | "farmStack"
            | "legends",
          sourceIndex,
        );
      }
    }
  };

  return (
    <CardRow
      cards={cityOwner.city}
      location="city"
      cityColor={color}
      onLeftClick={(index, card) => {
        if (isDiscarding && card) {
          toggleCardDiscarding(storedId, "city", index);
        } else if (opponentCanSteal && opponentIsPlaying && card) {
          toggleCardPlaying(storedId, "city", index, color);
        }
      }}
      onDrop={handleDrop}
      isDropTarget={game.turn === color && !isDiscarding}
    />
  );
}

export default City;
