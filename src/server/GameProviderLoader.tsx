import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GameState } from "../engine/gameTypes";
import { doc, getFirestore, onSnapshot } from "firebase/firestore";
import { GameProvider } from "../engine/GameContext";

const GameProviderLoader = ({ children }: { children: React.ReactNode }) => {
  const { gameId } = useParams();
  const [game, setGame] = useState<GameState | null>(null);

  useEffect(() => {
    if (!gameId) return;
    const dbRef = doc(getFirestore(), `games/${gameId}`);
    const unsubscribe = onSnapshot(dbRef, (snapshot) => {
      const data = snapshot.data();
      if (data) setGame(data as GameState);
    });
    return () => unsubscribe();
  }, [gameId]);

  if (!game || !gameId) return <div>Loading game...</div>;

  return (
    <GameProvider game={game} gameId={gameId}>
      {children}
    </GameProvider>
  );
};

export default GameProviderLoader;
