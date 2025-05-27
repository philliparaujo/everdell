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
    harvest
  } = useGame();

  const currentPlayer = game.players[game.turn];
  const isDiscarding = currentPlayer.discarding;
  const isPlaying = currentPlayer.playing;

  return (
    <div style={{ marginTop: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '2px' }}>
      <div>
        <button onClick={() => drawCard(game.turn)}>Draw Card</button>
      </div>
      <div>
        <button onClick={() => addToMeadow()}>Refill Meadow</button>
      </div>
      <div>
        <button onClick={() => {
          if (isPlaying) playSelectedCards(game.turn);
          setPlaying(game.turn, !isPlaying);
        }}>{isPlaying ? "Confirm play" : "Play cards"}</button>
      </div>
      <div>
        <button onClick={() => {
          if (isDiscarding) discardSelectedCards(game.turn);
          setDiscarding(game.turn, !isDiscarding);
        }}>{isDiscarding ? "Confirm discard" : "Discard cards"}</button>
      </div>
      <div>
        <button style={{ background: 'yellow' }} onClick={() => endTurn()}>End Turn</button>
      </div>
      <div>
        <button style={{ background: 'yellow' }} onClick={() => harvest(game.turn)}>Harvest</button>
      </div>
    </div>
  );
}

export default Controls;