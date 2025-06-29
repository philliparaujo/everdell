import { useGame } from "../engine/GameContext";
import { Journey } from "../engine/gameTypes";
import {
  canVisitJourney,
  getPlayerColor,
  getPlayerId,
  isNotYourTurn,
} from "../engine/helpers";
import { ResourceIcon } from "./Icons";
import {
  arrowResourceStyling,
  BaseLocationDisplay,
  locationsDisplayStyling,
  renderButtons,
  renderWorkers,
} from "./LocationsDisplay";

function JourneyDisplay({
  journey,
  index,
}: {
  journey: Journey;
  index: number;
}) {
  const { game, visitJourney } = useGame();

  const storedId = getPlayerId();
  const playerColor = getPlayerColor(game, storedId);

  const disabled = isNotYourTurn(game, storedId);
  const canVisit =
    playerColor === null
      ? false
      : canVisitJourney(game, journey, playerColor, 1);
  const canLeave =
    playerColor === null
      ? false
      : canVisitJourney(game, journey, playerColor, -1);

  return (
    <BaseLocationDisplay
      exclusive={journey.exclusive}
      titleChildren={
        <div aria-hidden="true" style={{ visibility: "hidden" }}>
          .
        </div>
      }
      buttonChildren={renderButtons(
        disabled || !canVisit,
        disabled || !canLeave,
        () => visitJourney(storedId, index, 1),
        () => visitJourney(storedId, index, -1),
      )}
      workerChildren={renderWorkers(journey)}
      resourceChildren={
        <div style={arrowResourceStyling}>
          <ResourceIcon type={"cards"} /> {`-${journey.discardCount}`}
          {"→"}
          <ResourceIcon type={"coins"} /> {journey.value}
        </div>
      }
    />
  );
}

function JourneysDisplay() {
  const { game } = useGame();

  return (
    <div style={locationsDisplayStyling}>
      {game.journeys.map((journey: Journey, index: number) => (
        <JourneyDisplay journey={journey} index={index} />
      ))}
    </div>
  );
}

export default JourneysDisplay;
