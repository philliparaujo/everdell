import { useParams } from "react-router-dom";
import { COLORS, PLAYER_COLORS } from "../colors";
import City from "../components/City";
import Discard from "../components/Discard";
import EventsDisplay from "../components/EventsDisplay";
import Hand from "../components/Hand";
import { ResourceIcon } from "../components/Icons";
import JourneysDisplay from "../components/JourneysDisplay";
import LocationsDisplay from "../components/LocationsDisplay";
import Meadow from "../components/Meadow";
import Sidebar from "../components/Sidebar";
import { useGame } from "../engine/GameContext";
import {
  getPlayerColor,
  getPlayerId,
  oppositePlayerOf,
} from "../engine/helpers";
import SpecialEventsDisplay from "../components/SpecialEventsDisplay";

const sideBarColumnStyling: React.CSSProperties = {
  width: "260px",
  flexShrink: 0,
  height: "100vh",
};

export const sideBarStyling: React.CSSProperties = {
  background: COLORS.sidebar,
  width: "260px",
  height: "100%",
  overflowY: "auto",
  overflowX: "hidden",
  position: "fixed",
  borderRight: `1px solid ${COLORS.sidebarBorder}`,
};

export const controlsStyling: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "8px",
  maxWidth: "400px",
  marginLeft: "auto",
  marginRight: "auto",
};

export const resourceBankStyling: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "8px",
  marginLeft: "auto",
  marginRight: "auto",
};

const playAreaStyling: React.CSSProperties = {
  flex: 1,
  padding: "16px",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
  minWidth: 0,
  background: COLORS.playArea,
};

export const headingStyling: React.CSSProperties = {
  margin: 0,
  display: "flex" /* Make it a flex container */,
  alignItems: "center" /* Vertically center items */,
  gap: "2px",
};

export const idStyle: React.CSSProperties = {
  fontSize: "11px",
  fontFamily: "monospace",
};

const fullRowStyling: React.CSSProperties = {};

const twoColumnRowStyling: React.CSSProperties = {
  display: "flex",
  gap: "32px",
};

const halfColumnStyling: React.CSSProperties = {
  flex: "0 1 auto", // Do not grow, allow shrinking, base size on content
  minWidth: 0, // Allows the item to shrink smaller than its content
  overflowX: "auto", // Enable horizontal scrolling when content overflows
};

const scrollStyle: React.CSSProperties = {
  display: "flex",
  overflowY: "hidden",
  scrollbarWidth: "thin",
};

export const cardRowStyle: React.CSSProperties = {
  ...scrollStyle,
  width: "100%",
  gap: "4px",
  padding: "4px",
  paddingInlineStart: 0,
  borderRadius: "4px",
  height: "100%",
};

function Game() {
  const { game } = useGame();
  const { gameId } = useParams();

  const storedId = getPlayerId();
  const playerColor = getPlayerColor(game, storedId) ?? game.turn;
  const spectating = getPlayerColor(game, storedId) === null;

  const player = game.players[playerColor];
  const oppositePlayer = game.players[oppositePlayerOf(playerColor)];

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        width: "100%",
        height: "100vh",
      }}
    >
      {/* --- Left Sidebar --- */}
      <div style={sideBarColumnStyling}>
        {/* Sidebar */}
        <Sidebar gameId={gameId} />
      </div>

      {/* --- Right Content Area --- */}
      <div style={playAreaStyling}>
        <div style={twoColumnRowStyling}>
          {/* APPLY halfColumnStyling HERE */}
          <section style={halfColumnStyling}>
            <h4 style={headingStyling}>Locations</h4>
            <div style={scrollStyle}>
              <LocationsDisplay />
            </div>
          </section>

          {game.players[game.turn].season === "Autumn" && (
            /* AND APPLY it HERE */
            <section style={halfColumnStyling}>
              <h4 style={headingStyling}>Journeys</h4>
              <div style={scrollStyle}>
                <JourneysDisplay />
              </div>
            </section>
          )}
        </div>

        <div style={twoColumnRowStyling}>
          {/* AND APPLY it HERE */}
          <section style={halfColumnStyling}>
            <h4 style={headingStyling}>Basic Events</h4>
            <div style={scrollStyle}>
              <EventsDisplay />
            </div>
          </section>

          {/* AND APPLY it HERE */}
          <section style={halfColumnStyling}>
            <h4 style={headingStyling}>Special Events</h4>
            <div style={scrollStyle}>
              <SpecialEventsDisplay />
            </div>
          </section>
        </div>

        {/* --- Full Width Rows --- */}
        {!spectating && (
          <section style={fullRowStyling}>
            <h4
              style={{ ...headingStyling, color: PLAYER_COLORS[playerColor] }}
            >
              Hand
            </h4>
            <div>
              <Hand color={playerColor} />
            </div>
          </section>
        )}

        <section style={fullRowStyling}>
          <h4 style={headingStyling}>Meadow</h4>
          <div>
            <Meadow />
          </div>
        </section>

        <section style={fullRowStyling}>
          <h4 style={{ ...headingStyling, color: PLAYER_COLORS[playerColor] }}>
            {spectating ? `${playerColor}'s` : "My"} City (
            <ResourceIcon type={"coins"} />{" "}
            {player.city.reduce((acc, curr) => acc + curr.value, 0)})
          </h4>
          <div>
            <City color={playerColor} />
          </div>
        </section>

        <section style={fullRowStyling}>
          <h4
            style={{
              ...headingStyling,
              color: PLAYER_COLORS[oppositePlayerOf(playerColor)],
            }}
          >
            {spectating ? `${oppositePlayerOf(playerColor)}'s` : "Opponent"}{" "}
            City (
            <ResourceIcon type={"coins"} />{" "}
            {oppositePlayer.city.reduce((acc, curr) => acc + curr.value, 0)})
          </h4>
          <div>
            <City color={oppositePlayerOf(playerColor)} />
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
