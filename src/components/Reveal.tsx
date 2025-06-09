import { COLORS } from "../colors";
import { MAX_REVEAL_SIZE } from "../engine/gameConstants";
import { useGame } from "../engine/GameContext";
import { Card } from "../engine/gameTypes";
import { canRevealDeck, canRevealDiscard, getPlayerId, isNotYourTurn, oppositePlayerOf } from "../engine/helpers";
import Button from "./Button";
import CardPreview from "./CardPreview";

function Reveal() {
  const {
    game,
    toggleCardDiscarding,
    toggleCardPlaying,
    revealCard,
  } = useGame();

  const currentPlayer = game.players[game.turn];
  const isDiscarding = currentPlayer.discarding;
  const isPlaying = currentPlayer.playing;

  const oppositePlayer = game.players[oppositePlayerOf(game.turn)];

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

  const onLeftClick = (index: number, card: Card | null) => {
    if (isDiscarding && card) {
      toggleCardDiscarding(storedId, "reveal", index);
    } else if (isPlaying && card) {
      toggleCardPlaying(storedId, "reveal", index);
    }
  }

  const revealDeck = canRevealDeck(currentPlayer, oppositePlayer);
  const revealDiscard = canRevealDiscard(currentPlayer);
  const revealEmpty = game.reveal.length === 0;

  return (
    <>
      {(revealDeck || revealDiscard || !revealEmpty) && <>
        <hr />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          {revealDeck && <Button disabled={disabled} style={{ backgroundColor: COLORS.rareButton }} onClick={() => revealCard(storedId, "deck")}>Reveal deck</Button>}
          {revealDiscard && <Button disabled={disabled} style={{ backgroundColor: COLORS.rareButton }} onClick={() => revealCard(storedId, "discard")}>Reveal discard</Button>}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
          {Array.from({ length: MAX_REVEAL_SIZE }).map((_, index) => {
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
            )
          })}
        </div>
      </>}
    </>
  )
}

export default Reveal;