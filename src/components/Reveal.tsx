import { COLORS } from "../colors";
import { MAX_REVEAL_SIZE } from "../engine/gameConstants";
import { useGame } from "../engine/GameContext";
import { Card } from "../engine/gameTypes";
import { getPlayerId, isNotYourTurn } from "../engine/helpers";
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

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

  const onLeftClick = (index: number, card: Card | null) => {
    if (isDiscarding && card) {
      toggleCardDiscarding(storedId, "reveal", index);
    } else if (isPlaying && card) {
      toggleCardPlaying(storedId, "reveal", index);
    }
  }

  const canRevealDeck = currentPlayer.city.reduce((acc, curr) => acc || curr.name === "Cemetery" || curr.name === "Postal Pigeon", false);
  const canRevealDiscard = currentPlayer.city.reduce((acc, curr) => acc || curr.name === "Cemetery", false);
  const revealEmpty = game.reveal.length === 0;

  return (
    <>
      {(canRevealDeck || canRevealDiscard || !revealEmpty) && <>
        <hr />
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          {canRevealDeck && <Button disabled={disabled} style={{ backgroundColor: COLORS.rareButton }} onClick={() => revealCard(storedId, "deck")}>Reveal deck</Button>}
          {canRevealDiscard && <Button disabled={disabled} style={{ backgroundColor: COLORS.rareButton }} onClick={() => revealCard(storedId, "discard")}>Reveal discard</Button>}
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