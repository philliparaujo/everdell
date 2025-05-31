import { useParams } from "react-router-dom";
import whitecoin from "../assets/icons/whitecoin.png";
import City from "../components/City";
import Discard from "../components/Discard";
import EventsDisplay from '../components/EventsDisplay';
import Hand from "../components/Hand";
import { CustomResourceIcon } from "../components/Icons";
import LocationsDisplay from '../components/LocationsDisplay';
import Meadow from "../components/Meadow";
import Sidebar from '../components/Sidebar';
import { useGame } from '../engine/GameContext';
import { PlayerColor } from "../engine/gameTypes";
import { getPlayerId } from "../engine/helpers";

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
  width: '30%'
};

function Game() {
  const {
    game,
  } = useGame();
  const { gameId } = useParams();

  const storedId = getPlayerId();
  let playerColor: PlayerColor = game.turn;
  if (storedId === null) {
    console.log("Could not find a player ID");
  } else {
    if (storedId === game.players.Red.id) {
      playerColor = "Red";
    } else if (storedId === game.players.Blue.id) {
      playerColor = "Blue";
    }
  }

  const player = game.players[playerColor];
  const backgroundColor = game.turn === "Red" ? '#FFDDDD' : "#DDDDFF";

  const oppositePlayerColor = playerColor === "Red" ? "Blue" : "Red";
  const oppositePlayer = game.players[oppositePlayerColor];

  return (
    <div style={{ display: 'flex', flexDirection: 'row', gap: '8px', padding: '16px', fontFamily: 'sans-serif', background: backgroundColor }}>
      <div>
        <Sidebar gameId={gameId} />
      </div>
      <div style={{ display: 'block', padding: '16px', fontFamily: 'sans-serif' }}>
        <LocationsDisplay />
        <EventsDisplay />

        {/* Meadow */}
        <section>
          <h4>Meadow</h4>
          <Meadow />
        </section>

        {/* Hand */}
        <section>
          <h4 style={{ color: playerColor }}>Hand</h4>
          <Hand color={playerColor} />
        </section>

        {/* My City */}
        <section>
          <h4 style={{ color: playerColor }}>
            My City (
            <CustomResourceIcon path={whitecoin} /> {player.city.reduce((acc, curr) => acc + curr.value, 0)}
            )
          </h4>
          <City color={playerColor} />
        </section>

        {/* Opposite City */}
        <section>
          <h4 style={{ color: oppositePlayerColor }}>
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
    </div>
  );
}

export default Game;
