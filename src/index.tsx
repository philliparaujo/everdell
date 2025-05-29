import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, HashRouter as Router, Routes } from 'react-router-dom';
import { GameProviderLoader } from './engine/GameContext';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Game from './screens/Game';
import Home from './screens/Home';
import Lobby from './screens/Lobby';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/lobby" element={<Lobby />} />
        <Route path="/game/:gameId" element={
          <GameProviderLoader>
            <Game />
          </GameProviderLoader>
        } />
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
