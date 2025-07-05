import { useGame } from "../engine/GameContext";
import { Card } from "../engine/gameTypes";
import { canRevealDeck, canRevealDiscard } from "../utils/gameLogic";
import { getPlayerId } from "../utils/identity";
import CardPreview from "./CardPreview";

function Reveal() {
  const { game, toggleCardDiscarding, toggleCardPlaying, toggleCardGiving } =
    useGame();

  const currentPlayer = game.players[game.turn];
  const isDiscarding = currentPlayer.discarding;
  const isPlaying = currentPlayer.playing;
  const isGiving = currentPlayer.giving;

  const storedId = getPlayerId();

  const onLeftClick = (index: number, card: Card | null) => {
    if (isDiscarding && card) {
      toggleCardDiscarding(storedId, "reveal", index);
    } else if (isPlaying && card) {
      toggleCardPlaying(storedId, "reveal", index);
    } else if (isGiving && card) {
      toggleCardGiving(storedId, "reveal", index);
    }
  };

  const revealDeck = canRevealDeck(game, game.turn);
  const revealDiscard = canRevealDiscard(game, game.turn);
  const revealEmpty = game.reveal.length === 0;

  const displayRevealCard = (index: number) => {
    const card = game.reveal[index] ?? null;

    return (
      <CardPreview
        key={index}
        index={index}
        card={card}
        location="reveal"
        cityColor={null}
        onLeftClick={() => onLeftClick(index, card)}
      />
    );
  };

  return (
    <>
      {(revealDeck || revealDiscard || !revealEmpty) && (
        <>
          <hr />
          <div className="flex flex-col gap-2">
            <div className="flex justify-between">
              {Array.from({ length: 2 }).map((_, index) =>
                displayRevealCard(index),
              )}
            </div>
            <div className="flex justify-between">
              {Array.from({ length: 2 }).map((_, index) =>
                displayRevealCard(index + 2),
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Reveal;
