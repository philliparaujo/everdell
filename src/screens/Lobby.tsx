import { collection, deleteDoc, doc, getDoc, getDocs, setDoc } from 'firebase/firestore';
import { Link, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { setupGame } from '../engine/GameContext';
import { GameState } from '../engine/gameTypes';
import { firestore } from '../firebase';
import { useEffect, useState } from 'react';

function Lobby() {
  const navigate = useNavigate();
  const [gameList, setGameList] = useState<{ id: string }[]>([]);

  const startGame = async () => {
    const gameId = uuidv4();

    const playerId = localStorage.getItem('playerId');
    if (playerId === null) return;

    const gameState: GameState = setupGame("Red");
    gameState.players.Red.id = playerId;

    await setDoc(doc(firestore, `games/${gameId}`), gameState);

    navigate(`/game/${gameId}`);
  };

  const handleJoinGame = async (gameId: string) => {
    const playerId = localStorage.getItem('playerId');
    if (!playerId) return;

    const gameDocRef = doc(firestore, 'games', gameId);
    const snapshot = await getDoc(gameDocRef);
    const game = snapshot.data() as GameState;

    if (!game) return alert("Game not found");
    if (game.players.Blue.id) return alert("Blue slot already taken");

    game.players.Blue.id = playerId;
    await setDoc(gameDocRef, game);

    navigate(`/game/${gameId}`);
  }

  const handleDeleteGame = async (gameId: string) => {
    await deleteDoc(doc(firestore, 'games', gameId));
    setGameList((prev) => prev.filter((game) => game.id !== gameId));
  };

  useEffect(() => {
    const fetchGames = async () => {
      const snapshot = await getDocs(collection(firestore, 'games'));
      const games = snapshot.docs.map((doc) => ({ id: doc.id }));
      setGameList(games);
    };

    fetchGames();
  }, []);

  return (
    <div>
      <p>LOBBY SCREEN</p>
      <div>
        <Link to="/">{"Go back to home"}</Link>
      </div>
      <div>
        <button onClick={startGame}>{"Start game"}</button>
      </div>

      <div>
        <h4>Available Games</h4>
        {gameList.length === 0 && <p>No games found.</p>}
        <ul>
          {gameList.map((game) => (
            <li key={game.id}>
              {game.id}
              <button onClick={() => handleJoinGame(game.id)}>Join as Blue</button>
              <button onClick={() => handleDeleteGame(game.id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Lobby;