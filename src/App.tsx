import { Navigate, Route, Routes } from 'react-router-dom';
import { GameProviderLoader } from './engine/GameContext';
import Game from './screens/Game';
import Home from './screens/Home';
import Lobby from './screens/Lobby';

const App = () => {

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
