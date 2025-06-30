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
import { db } from "../server/firebase";
import { useEffect, useState } from "react";
import { getPlayerId, getPlayerName } from "../engine/helpers";
import Button from "../components/Button";
import Navigation from "../components/Navigation";
import { COLORS, PLAYER_COLORS } from "../colors";
import Id from "../components/Id";

const GamePlayerDisplay = ({
  player,
  isYou,
}: {
  player: Player;
  isYou: boolean;
}) => {
  const color = player.color;
  const displayName = !player.id
    ? color
    : `${isYou ? "(Me) " : ""}${player.name}`;
  const displayId = !player.id ? "Open Slot" : player.id;

  return (
    <div>
      <div className="font-bold" style={{ color: PLAYER_COLORS[color] }}>
        {displayName}
      </div>
      <Id id={displayId} />
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
    <div className="max-w-7xl mx-auto p-4 flex flex-col h-screen">
      <div className="flex-shrink-0">
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

        <h2 className="mb-4 text-lg font-bold">Available Games</h2>

        <div className="mb-4">
          <Button
            onClick={startGame}
            disabled={isDisabled}
            color={COLORS.importantButton}
          >
            Start New Game
          </Button>
        </div>

        {gameList.length === 0 && <p className="italic">No games found.</p>}
      </div>

      {/* Game List Grid */}
      <ul className="list-none p-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 overflow-y-auto pr-2 ">
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
              className="border rounded-lg p-4 flex flex-col gap-4"
              style={{
                borderColor: COLORS.containerBorder,
                backgroundColor: COLORS.container,
              }}
            >
              <div className="flex items-baseline gap-1">
                <strong>Game ID:</strong>
                <Id id={id} />
              </div>

              <div className="flex justify-between min-h-[40px]">
                <GamePlayerDisplay
                  player={redPlayer}
                  isYou={playerId === redPlayer.id}
                />
                <GamePlayerDisplay
                  player={bluePlayer}
                  isYou={playerId === bluePlayer.id}
                />
              </div>

              <div
                className="flex justify-between items-end gap-3 mt-auto pt-3 border-t"
                style={{ borderTopColor: COLORS.containerBorder }}
              >
                <div className="flex gap-2 flex-wrap">
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
