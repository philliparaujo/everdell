import { useParams } from "react-router-dom";
import whitecoin from "../assets/icons/whitecoin.png";
import CardPreview from '../components/CardPreview';
import EventsDisplay from '../components/EventsDisplay';
import { CustomResourceIcon } from "../components/Icons";
import LocationsDisplay from '../components/LocationsDisplay';
import PlayerStatuses from '../components/PlayerStatus';
import { useGame } from '../engine/GameContext';
import Hand from "../components/Hand";
import Meadow from "../components/Meadow";
import City from "../components/City";
import Discard from "../components/Discard";

export const scrollRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'nowrap',
  overflowX: 'auto',
  overflowY: 'hidden',
  gap: '8px',
  padding: '4px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  height: '100%',
};

function Game() {
  const {
    game,
  } = useGame();
  const { gameId } = useParams();

  const currentPlayer = game.players[game.turn];

  const oppositePlayerColor = game.turn === "Red" ? "Blue" : "Red";
  const oppositePlayer = game.players[oppositePlayerColor];

  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif' }}>
      <div>Game ID: {gameId}</div>
      <div>Red ID: {game.players.Red.id}</div>
      <div>Blue ID: {game.players.Blue.id}</div>
      <LocationsDisplay />
      <EventsDisplay />
      <PlayerStatuses />

      {/* Hand */}
      <section>
        <h4>Hand</h4>
        <Hand />
      </section>

      {/* Meadow */}
      <section>
        <h4>Meadow</h4>
        <Meadow />
      </section>

      {/* My City */}
      <section>
        <h4>
          My City (
          <CustomResourceIcon path={whitecoin} /> {currentPlayer.city.reduce((acc, curr) => acc + curr.value, 0)}
          )
        </h4>
        <City color={game.turn} />
      </section>

      {/* Opposite City */}
      <section>
        <h4>
          Opposite City (
          <CustomResourceIcon path={whitecoin} /> {oppositePlayer.city.reduce((acc, curr) => acc + curr.value, 0)}
          )
        </h4>
        <City color={oppositePlayerColor} />
      </section>

      {/* Discard Pile */}
      <section>
        <h4>Discard Pile</h4>
        <Discard />
      </section>
    </div>
  );
}

export default Game;
