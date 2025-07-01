import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import Button from "../components/Button";
import GameList from "../components/GameList";
import Navigation from "../components/Navigation";
import { setupGame } from "../engine/GameContext";
import { GameState, PlayerColor } from "../engine/gameTypes";
import { getPlayerId, getPlayerName } from "../engine/helpers";
import { db } from "../server/firebase";

function Lobby() {
  const navigate = useNavigate();
  const [gameList, setGameList] = useState<{ id: string; game: GameState }[]>(
    [],
  );
  const [name] = useState(() => getPlayerName() || "");
  const [playerId] = useState(() => getPlayerId() || null);

  const isDisabled = !playerId;

  const startGame = async () => {
    if (isDisabled) return;
    const gameId = uuidv4();
    const gameState: GameState = setupGame("Red");
    gameState.players.Red.id = playerId!;
    gameState.players.Red.name = name;
    await setDoc(doc(db, `games/${gameId}`), gameState);
    navigate(`/game/${gameId}`);
  };

  const handleJoinGame = async (gameId: string, color: PlayerColor) => {
    if (isDisabled) return;

    const gameRef = doc(db, "games", gameId);
    const snapshot = await getDoc(gameRef);
    const game = snapshot.data() as GameState;

    if (!game) return alert("Game not found");

    const targetPlayer = game.players[color];
    if (targetPlayer.id && targetPlayer.id !== playerId)
      return alert(`${color} player slot is already taken.`);

    await updateDoc(gameRef, {
      [`players.${color}.id`]: playerId,
      [`players.${color}.name`]: name,
    });
    navigate(`/game/${gameId}`);
  };

  const handleRejoinGame = async (gameId: string) => {
    if (isDisabled) return;

    const gameRef = doc(db, "games", gameId);
    const snapshot = await getDoc(gameRef);
    const game = snapshot.data() as GameState;

    if (!game) return alert("Game not found");

    let color: PlayerColor | null = null;
    if (game.players.Red.id === playerId) {
      color = "Red";
    } else if (game.players.Blue.id === playerId) {
      color = "Blue";
    }

    if (color === null) {
      return alert(`Could not rejoin game.`);
    }

    await updateDoc(gameRef, {
      [`players.${color}.name`]: name,
    });
    navigate(`/game/${gameId}`);
  };

  const handleSpectateGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const handleDeleteGame = async (gameId: string) => {
    if (isDisabled) return;
    await deleteDoc(doc(db, "games", gameId));
    setGameList((prev) => prev.filter((g) => g.id !== gameId));
  };

  const fetchGames = async () => {
    const snapshot = await getDocs(collection(db, "games"));
    const games: { id: string; game: GameState }[] = snapshot.docs.map(
      (doc) => ({
        id: doc.id,
        game: doc.data() as GameState,
      }),
    );
    setGameList(games);
  };

  useEffect(() => {
    fetchGames();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 flex flex-col h-screen">
      <div className="flex-shrink-0">
        {/* Header */}
        <div className="flex justify-between items-center flex-wrap mb-8">
          <div>
            <span>
              <strong>Display Name:</strong> {name || "Not Set"}
            </span>
            <span className="ml-6">
              <strong>ID:</strong>{" "}
              <span className="font-mono">{playerId || "Not Set"}</span>
            </span>
          </div>
          <div className="flex gap-2">
            <Navigation
              link="/home"
              displayText="Back to Home"
              arrow="backward"
            />
          </div>
        </div>

        {/* Title and start button */}
        <h2 className="mb-4 text-lg font-bold">Available Games</h2>

        <div className="mb-4">
          <Button onClick={startGame} disabled={isDisabled} variant="important">
            Start New Game
          </Button>
        </div>

        {gameList.length === 0 && <p className="italic">No games found.</p>}
      </div>

      {/* Game list grid */}
      <GameList
        list={gameList}
        playerId={playerId}
        onJoinGame={handleJoinGame}
        onRejoinGame={handleRejoinGame}
        onSpectateGame={handleSpectateGame}
        onDeleteGame={handleDeleteGame}
      />
    </div>
  );
}

export default Lobby;
