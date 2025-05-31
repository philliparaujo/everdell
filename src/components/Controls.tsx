import { useGame } from "../engine/GameContext";
import { getPlayerId, isNotYourTurn, isSafeToEndTurn } from "../engine/helpers";

function Controls() {
  const {
    game,
    endTurn,
    setDiscarding,
    setPlaying,
    discardSelectedCards,
    playSelectedCards,
    drawCard,
    addToMeadow,
    harvest
  } = useGame();

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

  const currentPlayer = game.players[game.turn];
  const isDiscarding = currentPlayer.discarding;
  const isPlaying = currentPlayer.playing;

  return (
    <div
      style={{
        marginTop: '16px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '8px',
        maxWidth: '400px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}
    >
      <button disabled={disabled} onClick={() => drawCard(storedId)}>Draw Card</button>
      <button disabled={disabled} onClick={() => addToMeadow(storedId)}>Refill Meadow</button>
      <button disabled={disabled}
        onClick={() => {
          if (isPlaying) playSelectedCards(storedId);
          setPlaying(storedId, !isPlaying);
        }}
      >
        {isPlaying ? 'Confirm play' : 'Play cards'}
      </button>
      <button disabled={disabled}
        onClick={() => {
          if (isDiscarding) discardSelectedCards(storedId);
          setDiscarding(storedId, !isDiscarding);
        }}
      >
        {isDiscarding ? 'Confirm discard' : 'Discard cards'}
      </button>
      <button disabled={disabled || !isSafeToEndTurn(game)} style={{ background: 'yellow' }} onClick={() => endTurn(storedId)}>
        End Turn
      </button>
      <button disabled={disabled || !isSafeToEndTurn(game)} style={{ background: 'yellow' }} onClick={() => harvest(storedId)}>
        Harvest
      </button>
    </div>
  );
}

export default Controls;
