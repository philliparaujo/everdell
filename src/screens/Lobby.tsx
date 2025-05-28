import { doc, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { setupGame } from '../engine/GameContext';
import { GameState } from '../engine/gameTypes';
import { firestore } from '../firebase';

function Lobby() {
  const navigate = useNavigate();

  const startGame = async () => {
    const gameId = uuidv4();

    const playerId = localStorage.getItem('playerId');
    if (playerId === null) return;

    const gameState: GameState = setupGame("Red");
    gameState.players.Red.id = playerId;

    await setDoc(doc(firestore, `games/${gameId}`), gameState);

    navigate(`/game/${gameId}`);
  }

  return (
    <div>
      <p>LOBBY SCREEN</p>
      <div>
        <Link to="/">{"Go back to home"}</Link>
      </div>
      <div>
        <button onClick={startGame}>{"Start game"}</button>
      </div>
    </div>
  );
}

export default Lobby;