import { useGame } from "../engine/GameContext";

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
  } = useGame();

  const currentPlayer = game.players[game.turn];
  const isDiscarding = currentPlayer.discarding;
  const isPlaying = currentPlayer.playing;

  return (
    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'center', gap: '12px' }}>
      <button onClick={() => drawCard(game.turn)}>Draw Card</button>
      <button onClick={() => {
        if (isDiscarding) discardSelectedCards(game.turn);
        setDiscarding(game.turn, !isDiscarding);
      }}>{isDiscarding ? "Confirm discard" : "Discard cards"}</button>
      <button onClick={() => {
        if (isPlaying) playSelectedCards(game.turn);
        setPlaying(game.turn, !isPlaying);
      }}>{isPlaying ? "Confirm play" : "Play cards"}</button>
      <button onClick={() => endTurn()}>End Turn</button>
      <button onClick={() => addToMeadow()}>Add To Meadow</button>
      <h5 style={{ textAlign: 'center' }}>MY TURN</h5>
    </div>
  );
}

export default Controls;