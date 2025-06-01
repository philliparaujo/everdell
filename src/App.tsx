import { Navigate, Route, Routes } from 'react-router-dom';
import { GameProviderLoader } from './engine/GameContext';
import Game from './screens/Game';
import Home from './screens/Home';
import Lobby from './screens/Lobby';
import { COLORS } from './colors';
import { useEffect } from 'react';

const App = () => {
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--background', COLORS.background);
    root.style.setProperty('--text', COLORS.text);
    root.style.setProperty('--color-scheme', COLORS.colorScheme);
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/lobby" element={<Lobby />} />
      <Route path="/game/:gameId" element={
        <GameProviderLoader>
          <Game />
        </GameProviderLoader>
      } />
    </Routes>
  );
};

export default App;
