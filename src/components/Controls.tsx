import { COLORS } from "../colors";
import { useGame } from "../engine/GameContext";
import { getPlayerId, isNotYourTurn, isSafeToEndTurn } from "../engine/helpers";
import { controlsStyling } from "../screens/Game";
import Button from "./Button";

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
      style={controlsStyling}
    >
      <Button disabled={disabled} onClick={() => drawCard(storedId)}>Draw Card</Button>
      <Button disabled={disabled} onClick={() => addToMeadow(storedId)}>Refill Meadow</Button>
      <Button disabled={disabled || isDiscarding}
        onClick={() => {
          if (isPlaying) playSelectedCards(storedId);
          setPlaying(storedId, !isPlaying);
        }}
      >
        {isPlaying ? 'Confirm play' : 'Play cards'}
      </Button>
      <Button disabled={disabled || isPlaying}
        onClick={() => {
          if (isDiscarding) discardSelectedCards(storedId);
          setDiscarding(storedId, !isDiscarding);
        }}
      >
        {isDiscarding ? 'Confirm discard' : 'Discard cards'}
      </Button>
      <Button disabled={disabled || !isSafeToEndTurn(game)} style={{ backgroundColor: COLORS.importantButton }} onClick={() => endTurn(storedId)}>
        End Turn
      </Button>
      <Button disabled={disabled || !isSafeToEndTurn(game)} style={{ backgroundColor: COLORS.importantButton }} onClick={() => harvest(storedId)}>
        Harvest
      </Button>
    </div>
  );
}

export default Controls;
