import { useGame } from "../engine/GameContext";
import {
  canGiveToOpponent,
  canGiveToSelf,
  canRevealDeck,
  canRevealDiscard,
  getPlayerId,
  isNotYourTurn,
  isSafeToEndTurn,
  oppositePlayerOf,
} from "../engine/helpers";
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
  } = useGame();

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

  const currentPlayer = game.players[game.turn];
  const isDiscarding = currentPlayer.discarding;
  const isPlaying = currentPlayer.playing;
  const isGiving = currentPlayer.giving;

  const oppositePlayer = game.players[oppositePlayerOf(game.turn)];

  const canGiveSelf = canGiveToSelf(currentPlayer, game.specialEvents);
  const canGiveOpponent = canGiveToOpponent(currentPlayer, oppositePlayer);
  const revealDeck = canRevealDeck(
    currentPlayer,
    oppositePlayer,
    game.specialEvents,
  );
  const revealDiscard = canRevealDiscard(currentPlayer);

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
    </div>
  );
}

export default Controls;
