import { useParams } from "react-router-dom";
import City from "../components/City";
import Discard from "../components/Discard";
import Hand from "../components/Hand";
import Meadow from "../components/Meadow";
import Sidebar from '../components/Sidebar';
import { useGame } from '../engine/GameContext';
import { PlayerColor } from "../engine/gameTypes";
import { getPlayerId } from "../engine/helpers";
import LocationsDisplay from "../components/LocationsDisplay";
import EventsDisplay from "../components/EventsDisplay";
import { CustomResourceIcon } from "../components/Icons";
import whitecoin from "../assets/icons/whitecoin.png";

const sideBarColumnStyling: React.CSSProperties = {
  width: '250px',
  borderRight: '1px solid #ccc',
  flexShrink: 0,
}

export const sideBarStyling: React.CSSProperties = {
  background: '#DCBA9E',
  width: '250px',
  height: '100%',
}

export const controlsStyling: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px',
  maxWidth: '400px',
  marginLeft: 'auto',
  marginRight: 'auto'
}

export const resourceBankStyling: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '8px',
  marginLeft: 'auto',
  marginRight: 'auto'
}

const playAreaStyling: React.CSSProperties = {
  flex: 1,
  padding: '16px',
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  minWidth: 0,
}

export const headingStyling: React.CSSProperties = {
  margin: 0
}

export const idStyle: React.CSSProperties = {
  fontSize: '10px',
  fontStyle: 'italic'
}

const fullRowStyling: React.CSSProperties = {
}

const twoColumnRowStyling: React.CSSProperties = {
  display: 'flex',
  gap: '32px'
}

const halfColumnStyling: React.CSSProperties = {
  flex: 1, // Equally share the width
  minWidth: 0,
  overflowX: 'auto',
}

const scrollStyle: React.CSSProperties = {
  display: 'flex',
  overflowY: 'hidden',
  scrollbarWidth: 'thin'
}

export const cardRowStyle: React.CSSProperties = {
  ...scrollStyle,
  gap: '4px',
  padding: '4px',
  paddingInlineStart: 0,
  borderRadius: '4px',
  height: '100%',
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
  // const backgroundColor = game.turn === "Red" ? '#FFDDDD' : "#DDDDFF";

  const oppositePlayerColor = playerColor === "Red" ? "Blue" : "Red";
  const oppositePlayer = game.players[oppositePlayerColor];

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      width: '100%',
      minHeight: '100vh' // Added for demonstration to fill the screen
    }}>
      {/* --- Left Sidebar --- */}
      <div style={sideBarColumnStyling}>
        {/* Sidebar */}
        <Sidebar gameId={gameId} />
      </div>

      {/* --- Right Content Area --- */}
      <div style={{
        ...playAreaStyling,
        // background: backgroundColor
      }}>
        <section>
          <h4 style={headingStyling}>Locations</h4>
          <div style={scrollStyle}>
            <LocationsDisplay />
          </div>
        </section>

        <section>
          <h4 style={headingStyling}>Events</h4>
          <div style={scrollStyle}>
            <EventsDisplay />
          </div>
        </section>

        {/* --- Two Column Row --- */}
        <div style={twoColumnRowStyling}>
          {/* Column 1 */}
          <section style={halfColumnStyling}>
            <h4 style={{ ...headingStyling, color: playerColor }}>
              Hand
            </h4>
            <div>
              <Hand color={playerColor} />
            </div>
          </section>
          {/* Column 2 */}
          <section style={halfColumnStyling}>
            <h4 style={headingStyling}>Meadow</h4>
            <div>
              <Meadow />
            </div>
          </section>
        </div>

        {/* --- Full Width Rows --- */}
        <section style={fullRowStyling}>
          <h4 style={{ ...headingStyling, color: playerColor }}>
            My City (
            <CustomResourceIcon path={whitecoin} /> {player.city.reduce((acc, curr) => acc + curr.value, 0)}
            )
          </h4>
          <div>
            <City color={playerColor} />
          </div>
        </section>

        <section style={fullRowStyling}>
          <h4 style={{ ...headingStyling, color: oppositePlayerColor }}>
            Opponent City (
            <CustomResourceIcon path={whitecoin} /> {oppositePlayer.city.reduce((acc, curr) => acc + curr.value, 0)}
            )
          </h4>
          <div>
            <City color={oppositePlayerColor} />
          </div>
        </section>

        <section style={fullRowStyling}>
          <h4 style={headingStyling}>Discard</h4>
          <div>
            <Discard />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Game;
