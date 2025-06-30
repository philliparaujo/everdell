import { COLORS } from "../colors";
import { useGame } from "../engine/GameContext";
import { Card } from "../engine/gameTypes";
import {
  canRevealDeck,
  canRevealDiscard,
  getPlayerId,
  isNotYourTurn,
  oppositePlayerOf,
} from "../engine/helpers";
import Button from "./Button";
import CardPreview from "./CardPreview";

function Reveal() {
  const {
    game,
    toggleCardDiscarding,
    toggleCardPlaying,
    toggleCardGiving,
    revealCard,
  } = useGame();

  const currentPlayer = game.players[game.turn];
  const isDiscarding = currentPlayer.discarding;
  const isPlaying = currentPlayer.playing;
  const isGiving = currentPlayer.giving;

  const oppositePlayer = game.players[oppositePlayerOf(game.turn)];

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

  const onLeftClick = (index: number, card: Card | null) => {
    if (isDiscarding && card) {
      toggleCardDiscarding(storedId, "reveal", index);
    } else if (isPlaying && card) {
      toggleCardPlaying(storedId, "reveal", index);
    } else if (isGiving && card) {
      toggleCardGiving(storedId, "reveal", index);
    }
  };

  const revealDeck = canRevealDeck(
    currentPlayer,
    oppositePlayer,
    game.specialEvents,
  );
  const revealDiscard = canRevealDiscard(currentPlayer);
  const revealEmpty = game.reveal.length === 0;

  const displayRevealCard = (index: number) => {
    const card = game.reveal[index] ?? null;

    return (
      <CardPreview
        key={index}
        index={index}
        card={card}
        placedDown={false}
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
          <div className="grid grid-cols-2 gap-2 max-w-400px mx-auto pb-2">
            {revealDeck && (
              <Button
                disabled={disabled}
                color={COLORS.rareButton}
                onClick={() => revealCard(storedId, "deck")}
              >
                Reveal deck
              </Button>
            )}
            {revealDiscard && (
              <Button
                disabled={disabled}
                color={COLORS.rareButton}
                onClick={() => revealCard(storedId, "discard")}
              >
                Reveal discard
              </Button>
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {Array.from({ length: 2 }).map((_, index) =>
                displayRevealCard(index),
              )}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
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
