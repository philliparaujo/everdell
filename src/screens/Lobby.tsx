import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { setupGame } from "../engine/GameContext";
import { GameState, Player, PlayerColor } from "../engine/gameTypes";
import { db } from "../firebase";
import { useEffect, useState } from "react";
import { getPlayerId, getPlayerName } from "../engine/helpers";
import Button from "../components/Button";
import Navigation from "../components/Navigation";
import { COLORS, PLAYER_COLORS } from "../colors";
import { idStyle } from "./Game";

// Helper component to render player info consistent with the sidebar style
const GamePlayerDisplay = ({
  player,
  isYou,
}: {
  player: Player;
  isYou: boolean;
}) => {
  const color = player.color;

  // Render a styled "Open" slot
  if (!player.id) {
    return (
      <div>
        <div style={{ color: PLAYER_COLORS[color], fontWeight: "bold" }}>
          {color}
        </div>
        <div style={{ ...idStyle }}>Open Slot</div>
      </div>
    );
  }

  // Render a filled player slot
  return (
    <div>
      <div style={{ color: PLAYER_COLORS[color], fontWeight: "bold" }}>
        {isYou ? "(Me) " : ""}
        {player.name}
      </div>
      <div style={idStyle}>{player.id}</div>
    </div>
  );
};

function Lobby() {
  const navigate = useNavigate();
  const [gameList, setGameList] = useState<{ id: string; game: GameState }[]>(
    [],
  );
  const [name] = useState(() => getPlayerName() || "");
  const [playerId] = useState(() => getPlayerId() || null);

  // Buttons will be disabled if the user has no name or ID
  const isDisabled = !playerId || !name;

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
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "16px",
          marginBottom: "32px",
        }}
      >
        <div>
          <span>
            <strong>Display Name:</strong> {name || "Not Set"}
          </span>
          <span style={{ marginLeft: "24px" }}>
            <strong>ID:</strong> {playerId || "Not Set"}
          </span>
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <Navigation
            link="/home"
            displayText="Back to Home"
            arrow="backward"
          />
        </div>
      </div>

      <h3>Available Games</h3>

      <div>
        <Button
          onClick={startGame}
          disabled={isDisabled}
          color={COLORS.importantButton}
        >
          Start New Game
        </Button>
      </div>

      {gameList.length === 0 && <p>No games found.</p>}

      {/* Game List Grid */}
      <ul
        style={{
          listStyle: "none",
          padding: 0,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(400px, 1fr))",
          gap: "16px",
        }}
      >
        {gameList.map(({ id, game }) => {
          const redPlayer = game.players.Red;
          const bluePlayer = game.players.Blue;

          const isPlayerInGame =
            playerId && [redPlayer.id, bluePlayer.id].includes(playerId);
          const canJoinRed = !redPlayer.id;
          const canJoinBlue = !bluePlayer.id;

          return (
            <li
              key={id}
              style={{
                border: `1px solid ${COLORS.sidebarBorder}`,
                backgroundColor: COLORS.sidebar,
                borderRadius: "8px",
                padding: "16px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div>
                <strong>Game ID:</strong> {id}
              </div>

              {/* Player displays, evenly spaced */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  minHeight: "40px",
                }}
              >
                <GamePlayerDisplay
                  player={redPlayer}
                  isYou={playerId === redPlayer.id}
                />
                <GamePlayerDisplay
                  player={bluePlayer}
                  isYou={playerId === bluePlayer.id}
                />
              </div>

              {/* Action buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-end",
                  gap: "12px",
                  marginTop: "auto",
                  paddingTop: "12px",
                  borderTop: `1px solid ${COLORS.sidebarBorder}`,
                }}
              >
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {canJoinRed && !isPlayerInGame && (
                    <Button
                      onClick={() => handleJoinGame(id, "Red")}
                      disabled={isDisabled}
                      color={COLORS.importantButton}
                    >
                      Join as Red
                    </Button>
                  )}
                  {canJoinBlue && !isPlayerInGame && (
                    <Button
                      onClick={() => handleJoinGame(id, "Blue")}
                      disabled={isDisabled}
                      color={COLORS.importantButton}
                    >
                      Join as Blue
                    </Button>
                  )}
                  {isPlayerInGame && (
                    <Button
                      onClick={() => handleRejoinGame(id)}
                      color={COLORS.importantButton}
                    >
                      Rejoin
                    </Button>
                  )}
                  {!isPlayerInGame && (
                    <Button onClick={() => handleSpectateGame(id)}>
                      Spectate
                    </Button>
                  )}
                  <Button
                    onClick={() => handleDeleteGame(id)}
                    disabled={isDisabled}
                    color={COLORS.dangerButton}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Lobby;
