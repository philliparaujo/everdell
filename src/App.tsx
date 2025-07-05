import { Navigate, Route, Routes } from "react-router-dom";
import { CardManagementProvider } from "./engine/CardManagementContext";
import CardManagement from "./screens/CardManagement";
import Game from "./screens/Game";
import Home from "./screens/Home";
import Lobby from "./screens/Lobby";
import GameProviderLoader from "./server/GameProviderLoader";
import {
  CARD_MANAGEMENT_PATH,
  GAME_PATH,
  HOME_PATH,
  LOBBY_PATH,
} from "./utils/navigation";

const App = () => {
  return (
    <CardManagementProvider>
      <Routes>
        <Route path="/" element={<Navigate to={HOME_PATH} replace />} />
        <Route path={HOME_PATH} element={<Home />} />
        <Route path={LOBBY_PATH} element={<Lobby />} />
        <Route path={CARD_MANAGEMENT_PATH} element={<CardManagement />} />
        <Route
          path={`${GAME_PATH}/:gameId`}
          element={
            <GameProviderLoader>
              <Game />
            </GameProviderLoader>
          }
        />
      </Routes>
    </CardManagementProvider>
  );
};

export default App;
