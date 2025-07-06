import { useParams } from "react-router-dom";
import City from "../components/City";
import Discard from "../components/Discard";
import EventsDisplay from "../components/EventsDisplay";
import Hand from "../components/Hand";
import { ResourceIcon } from "../components/Icons";
import JourneysDisplay from "../components/JourneysDisplay";
import LocationsDisplay from "../components/LocationsDisplay";
import Meadow from "../components/Meadow";
import Sidebar from "../components/Sidebar";
import SpecialEventsDisplay from "../components/SpecialEventsDisplay";
import { useGame } from "../engine/GameContext";
import { oppositePlayerOf } from "../utils/gameLogic";
import { getPlayerColor, getPlayerId } from "../utils/identity";
import { stylePlayerColor } from "../utils/tailwind";
import { useCardManagement } from "../engine/CardManagementContext";
import Legends from "../components/Legends";

const HalfSection = ({
  title,
  titleColor = "",
  children,
}: {
  title: React.ReactNode;
  titleColor?: string;
  children: React.ReactNode;
}) => {
  return (
    <section className="flex-0-1-auto min-w-0 overflow-x-auto">
      <h3 className={`flex items-center gap-0.5 font-bold ${titleColor}`}>
        {title}
      </h3>
      <div
        className="flex flex-1 overflow-y-hidden"
        style={{ scrollbarWidth: "thin" }}
      >
        {children}
      </div>
    </section>
  );
};

const FullSection = ({
  title,
  titleColor = "",
  children,
}: {
  title: React.ReactNode;
  titleColor?: string;
  children: React.ReactNode;
}) => {
  return (
    <section>
      <h3 className={`flex items-center gap-0.5 font-bold ${titleColor}`}>
        {title}
      </h3>
      {children}
    </section>
  );
};

function Game() {
  const { game } = useGame();
  const { gameId } = useParams();
  const { activeExpansions } = useCardManagement();

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
      <div className="flex-1 p-4 flex flex-col gap-3 min-w-0 bg-play-area ml-sidebar">
        {/* --- Two Column Rows --- */}
        <div className="flex gap-8">
          <HalfSection title="Locations">
            <LocationsDisplay />
          </HalfSection>

          {game.players[game.turn].season === "Autumn" && (
            <HalfSection title="Journeys">
              <JourneysDisplay />
            </HalfSection>
          )}
        </div>

        <div className="flex gap-8">
          <HalfSection title="Basic Events">
            <EventsDisplay />
          </HalfSection>

          <HalfSection title="Special Events">
            <SpecialEventsDisplay />
          </HalfSection>
        </div>

        {/* --- Full Width Rows --- */}
        {!spectating && (
          <div className="flex gap-8">
            <HalfSection
              title="Hand"
              titleColor={stylePlayerColor(playerColor)}
            >
              <Hand color={playerColor} />
            </HalfSection>

            {activeExpansions.includes("legends") && (
              <HalfSection title="Legends">
                <Legends color={playerColor} />
              </HalfSection>
            )}
          </div>
        )}

        <FullSection title="Meadow">
          <Meadow />
        </FullSection>

        <FullSection
          title={
            <>
              {spectating ? `${playerColor}'s` : "My"} City (
              <ResourceIcon type={"coins"} />{" "}
              {player.city.reduce((acc, curr) => acc + curr.value, 0)})
            </>
          }
          titleColor={stylePlayerColor(playerColor)}
        >
          <City color={playerColor} />
        </FullSection>

        <FullSection
          title={
            <>
              {spectating ? `${oppositePlayerOf(playerColor)}'s` : "Opponent"}{" "}
              City (
              <ResourceIcon type={"coins"} />{" "}
              {oppositePlayer.city.reduce((acc, curr) => acc + curr.value, 0)})
            </>
          }
          titleColor={stylePlayerColor(oppositePlayerOf(playerColor))}
        >
          <City color={oppositePlayerOf(playerColor)} />
        </FullSection>

        <FullSection title="Discard">
          <Discard />
        </FullSection>
      </div>
    </div>
  );
}

export default Game;
