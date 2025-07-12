import { useGame } from "../engine/GameContext";
import {
  canGiveToOpponent,
  canGiveToSelf,
  canRevealDeck,
  canRevealDiscard,
  canStealCard,
  canSwapHands,
  isNotYourTurn,
  isSafeToEndTurn,
  oppositePlayerOf,
} from "../utils/gameLogic";
import { getPlayerId } from "../utils/identity";
import Button from "./Button";

function Controls() {
  const {
    game,
    endTurn,
    setDiscarding,
    setPlaying,
    setGiving,
    discardSelectedCards,
    playSelectedCards,
    giveSelectedCards,
    drawCard,
    refillMeadow,
    harvest,
    revealCard,
    swapHands,
  } = useGame();

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

  const currentPlayer = game.players[game.turn];
  const isDiscarding = currentPlayer.discarding;
  const isPlaying = currentPlayer.playing;
  const isGiving = currentPlayer.giving;

  const canGiveSelf = canGiveToSelf(game, game.turn);
  const canGiveOpponent = canGiveToOpponent(game, game.turn);
  const revealDeck = canRevealDeck(game, game.turn);
  const revealDiscard = canRevealDiscard(game, game.turn);
  const canSwap = canSwapHands(game, game.turn);
  const canSteal = canStealCard(game, game.turn);

  return (
    <div className="grid grid-cols-2 gap-2 max-w-400px">
      <Button disabled={disabled} onClick={() => drawCard(storedId)}>
        Draw Card
      </Button>
      <Button disabled={disabled} onClick={() => refillMeadow(storedId)}>
        Refill Meadow
      </Button>
      <Button
        disabled={disabled || isDiscarding || isGiving}
        onClick={() => {
          if (isPlaying) playSelectedCards(storedId);
          setPlaying(storedId, !isPlaying);
        }}
      >
        {isPlaying ? "Confirm play" : "Play cards"}
      </Button>
      <Button
        disabled={disabled || isPlaying || isGiving}
        onClick={() => {
          if (isDiscarding) discardSelectedCards(storedId);
          setDiscarding(storedId, !isDiscarding);
        }}
      >
        {isDiscarding ? "Confirm discard" : "Discard cards"}
      </Button>
      <Button
        disabled={disabled || !isSafeToEndTurn(game)}
        variant="important"
        onClick={() => endTurn(storedId)}
      >
        End Turn
      </Button>
      <Button
        disabled={disabled || !isSafeToEndTurn(game)}
        variant="important"
        onClick={() => harvest(storedId)}
      >
        Harvest
      </Button>
      {canGiveSelf && (
        <Button
          disabled={disabled || isDiscarding || isPlaying}
          variant="rare"
          onClick={() => {
            if (isGiving) giveSelectedCards(storedId, game.turn);
            setGiving(storedId, !isGiving);
          }}
        >
          {isGiving ? "Confirm (self)" : "Give to self"}
        </Button>
      )}
      {canGiveOpponent && (
        <Button
          disabled={disabled || isDiscarding || isPlaying}
          variant="rare"
          onClick={() => {
            if (isGiving)
              giveSelectedCards(storedId, oppositePlayerOf(game.turn));
            setGiving(storedId, !isGiving);
          }}
        >
          {isGiving ? "Confirm (opp.)" : "Give opponent"}
        </Button>
      )}
      {revealDeck && (
        <Button
          disabled={disabled}
          variant="rare"
          onClick={() => revealCard(storedId, "deck")}
        >
          Reveal deck
        </Button>
      )}
      {revealDiscard && (
        <Button
          disabled={disabled}
          variant="rare"
          onClick={() => revealCard(storedId, "discard")}
        >
          Reveal discard
        </Button>
      )}
      {canSwap && (
        <Button
          disabled={disabled}
          variant="rare"
          onClick={() => swapHands(storedId, oppositePlayerOf(game.turn))}
        >
          Swap hands
        </Button>
      )}
      {canSteal && (
        <Button
          disabled={disabled}
          variant="rare"
          onClick={() => {
            if (isPlaying) playSelectedCards(storedId);
            setPlaying(storedId, !isPlaying);
          }}
        >
          {isPlaying ? "Confirm steal" : "Steal cards"}
        </Button>
      )}
    </div>
  );
}

export default Controls;
