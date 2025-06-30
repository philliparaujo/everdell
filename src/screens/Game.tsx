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
import Sidebar, { SIDEBAR_WIDTH } from "../components/Sidebar";
import { useGame } from "../engine/GameContext";
import {
  getPlayerColor,
  getPlayerId,
  oppositePlayerOf,
} from "../engine/helpers";
import SpecialEventsDisplay from "../components/SpecialEventsDisplay";

function Game() {
  const { game } = useGame();
  const { gameId } = useParams();

  const storedId = getPlayerId();
  const playerColor = getPlayerColor(game, storedId) ?? game.turn;
  const spectating = getPlayerColor(game, storedId) === null;

  const player = game.players[playerColor];
  const oppositePlayer = game.players[oppositePlayerOf(playerColor)];

  return (
    <div className="flex flex-row w-full h-screen p-0">
      {/* --- Left Sidebar --- */}
      <div className={`h-screen`}>
        <Sidebar gameId={gameId} />
      </div>

      {/* --- Right Content Area --- */}
      <div
        className="flex-1 p-4 flex flex-col gap-3 min-w-0 bg-playArea"
        style={{
          background: COLORS.playArea,
          marginLeft: SIDEBAR_WIDTH,
        }}
      >
        {/* --- Two Column Rows --- */}
        <div className="flex gap-8">
          <section className="flex-0-1-auto min-w-0 overflow-x-auto">
            <h3 className="flex items-center gap-0.5 font-bold">Locations</h3>
            <div
              className="flex flex-1 overflow-y-hidden"
              style={{ scrollbarWidth: "thin" }}
            >
              <LocationsDisplay />
            </div>
          </section>

          {game.players[game.turn].season === "Autumn" && (
            <section className="flex-0-1-auto min-w-0 overflow-x-auto">
              <h3 className="flex items-center gap-0.5 font-bold">Journeys</h3>
              <div
                className="flex flex-1 overflow-y-hidden"
                style={{ scrollbarWidth: "thin" }}
              >
                <JourneysDisplay />
              </div>
            </section>
          )}
        </div>

        <div className="flex gap-8">
          <section className="flex-0-1-auto min-w-0 overflow-x-auto">
            <h3 className="flex items-center gap-0.5 font-bold">
              Basic Events
            </h3>
            <div
              className="flex flex-1 overflow-y-hidden"
              style={{ scrollbarWidth: "thin" }}
            >
              <EventsDisplay />
            </div>
          </section>

          <section className="flex-0-1-auto min-w-0 overflow-x-auto">
            <h3 className="flex items-center gap-0.5 font-bold">
              Special Events
            </h3>
            <div
              className="flex flex-1 overflow-y-hidden"
              style={{ scrollbarWidth: "thin" }}
            >
              <SpecialEventsDisplay />
            </div>
          </section>
        </div>

        {/* --- Full Width Rows --- */}
        {!spectating && (
          <section>
            <h3
              className="flex items-center gap-0.5 font-bold"
              style={{ color: PLAYER_COLORS[playerColor] }}
            >
              Hand
            </h3>
            <div>
              <Hand color={playerColor} />
            </div>
          </section>
        )}

        <section>
          <h3 className="flex items-center gap-0.5 font-bold">Meadow</h3>
          <div>
            <Meadow />
          </div>
        </section>

        <section>
          <h3
            className="flex items-center gap-0.5 font-bold"
            style={{ color: PLAYER_COLORS[playerColor] }}
          >
            {spectating ? `${playerColor}'s` : "My"} City (
            <ResourceIcon type={"coins"} />{" "}
            {player.city.reduce((acc, curr) => acc + curr.value, 0)})
          </h3>
          <div>
            <City color={playerColor} />
          </div>
        </section>

        <section>
          <h3
            className="flex items-center gap-0.5 font-bold"
            style={{ color: PLAYER_COLORS[oppositePlayerOf(playerColor)] }}
          >
            {spectating ? `${oppositePlayerOf(playerColor)}'s` : "Opponent"}{" "}
            City (
            <ResourceIcon type={"coins"} />{" "}
            {oppositePlayer.city.reduce((acc, curr) => acc + curr.value, 0)})
          </h3>
          <div>
            <City color={oppositePlayerOf(playerColor)} />
          </div>
        </section>

        <section>
          <h3 className="flex items-center gap-0.5 font-bold">Discard</h3>
          <div>
            <Discard />
          </div>
        </section>
      </div>
    </div>
  );
}

export default Game;
