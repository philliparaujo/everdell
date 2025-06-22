import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { setupGame } from "../engine/GameContext";
import { GameState } from "../engine/gameTypes";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { getPlayerId, getPlayerName } from "../engine/helpers";
import Button from "../components/Button";
import Navigation from "../components/Navigation";

function Lobby() {
  const navigate = useNavigate();
  const [gameList, setGameList] = useState<{ id: string; game: GameState }[]>(
    [],
  );
  const [name] = useState(() => getPlayerName() || "");
  const [playerId] = useState(() => getPlayerId() || null);

  const startGame = async () => {
    if (playerId === null) return;
    const gameId = uuidv4();
    const gameState: GameState = setupGame("Red");
    gameState.players.Red.id = playerId;
    gameState.players.Red.name = name;
    await setDoc(doc(db, `games/${gameId}`), gameState);
    navigate(`/game/${gameId}`);
  };

  const handleJoinGame = async (gameId: string, color: "Red" | "Blue") => {
    if (playerId === null) return;

    const gameRef = doc(db, "games", gameId);
    const snapshot = await getDoc(gameRef);
    const game = snapshot.data() as GameState;

    if (!game) return alert("Game not found");

    const targetPlayer = game.players[color];
    if (targetPlayer.id && targetPlayer.id !== playerId)
      return alert(`${color} player slot is already taken.`);

    game.players[color].id = playerId;
    game.players[color].name = name;
    await setDoc(gameRef, game);
    navigate(`/game/${gameId}`);
  };

  const handleRejoinGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const handleSpectateGame = (gameId: string) => {
    navigate(`/game/${gameId}`);
  };

  const handleDeleteGame = async (gameId: string) => {
    await deleteDoc(doc(db, "games", gameId));
    setGameList((prev) => prev.filter((g) => g.id !== gameId));
  };

  useEffect(() => {
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
    fetchGames();
  }, []);

  return (
    <div style={{ padding: "24px", maxWidth: "800px", margin: "0 auto" }}>
      <h2>Lobby</h2>
      <p>
        <strong>Player ID:</strong> {playerId}
      </p>
      <p>
        <strong>Display Name:</strong> {name}
      </p>

      <div style={{ marginTop: "16px", marginBottom: "32px" }}>
        <Button onClick={startGame}>Start New Game</Button>
        <Navigation link="/home" displayText="Back to Home" arrow="backward" />
      </div>

      <h3>Available Games</h3>
      {gameList.length === 0 && <p>No games found.</p>}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {gameList.map(({ id, game }) => {
          const red = game.players.Red;
          const blue = game.players.Blue;

          const isPlayerInGame =
            playerId && [red.id, blue.id].includes(playerId);
          const canJoinRed = !red.id;
          const canJoinBlue = !blue.id;

          return (
            <li
              key={id}
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "12px",
              }}
            >
              <div style={{ marginBottom: "8px" }}>
                <strong>Game ID:</strong> {id}
              </div>
              <div style={{ display: "flex", gap: "24px" }}>
                <div>
                  <strong>Red:</strong>{" "}
                  {red.name ? `${red.name} (${red.id})` : "Open"}
                </div>
                <div>
                  <strong>Blue:</strong>{" "}
                  {blue.name ? `${blue.name} (${blue.id})` : "Open"}
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  marginTop: "12px",
                  flexWrap: "wrap",
                }}
              >
                {canJoinRed && !isPlayerInGame && (
                  <Button onClick={() => handleJoinGame(id, "Red")}>
                    Join as Red
                  </Button>
                )}
                {canJoinBlue && !isPlayerInGame && (
                  <Button onClick={() => handleJoinGame(id, "Blue")}>
                    Join as Blue
                  </Button>
                )}
                {isPlayerInGame && (
                  <Button onClick={() => handleRejoinGame(id)}>Rejoin</Button>
                )}
                {!isPlayerInGame && (
                  <Button onClick={() => handleSpectateGame(id)}>
                    Spectate
                  </Button>
                )}
                <Button onClick={() => handleDeleteGame(id)}>Delete</Button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Lobby;
