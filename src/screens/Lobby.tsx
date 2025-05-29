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

  const [name, setName] = useState(() => sessionStorage.getItem('playerName') || '');
  const [playerId, setPlayerId] = useState(() => sessionStorage.getItem('playerId') || null);

  const startGame = async () => {
    const gameId = uuidv4();

    if (playerId === null) return;

    const gameState: GameState = setupGame("Red");
    gameState.players.Red.id = playerId;
    gameState.players.Red.name = name;

    await setDoc(doc(firestore, `games/${gameId}`), gameState);

    navigate(`/game/${gameId}`);
  };

  const handleJoinGame = async (gameId: string) => {
    if (playerId === null) return;

    const gameDocRef = doc(firestore, 'games', gameId);
    const snapshot = await getDoc(gameDocRef);
    const game = snapshot.data() as GameState;

    if (!game) return alert("Game not found");
    if (game.players.Blue.id) return alert("Blue player already taken");
    if (game.players.Red.id === playerId) return alert("Cannot join with same ID as red player");

    game.players.Blue.id = playerId;
    game.players.Blue.name = name;

    await setDoc(gameDocRef, game);

    navigate(`/game/${gameId}`);
  }

  const handleRejoinGame = async (gameId: string) => {
    if (playerId === null) return;

    const gameDocRef = doc(firestore, 'games', gameId);
    const snapshot = await getDoc(gameDocRef);
    const game = snapshot.data() as GameState;

    if (!game) return alert("Game not found");
    if (game.players.Red.id === game.players.Blue.id) return alert("Red and Blue have same ID, AHH");
    if (game.players.Red.id !== playerId && game.players.Blue.id !== playerId) return alert("Player IDs do not match");

    if (game.players.Red.id === playerId) {
      game.players.Red.name = name;
    } else {
      game.players.Blue.name = name;
    }

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

      <p>PlayerId: {playerId}</p>
      <p>Display Name: {name}</p>

      <div>
        <Link to="/home">{"Go back to home"}</Link>
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
              <button onClick={() => handleRejoinGame(game.id)}>Rejoin game</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Lobby;