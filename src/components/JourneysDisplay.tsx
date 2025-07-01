import { useGame } from "../engine/GameContext";
import { Journey } from "../engine/gameTypes";
import { canVisitJourney, isNotYourTurn } from "../utils/gameLogic";
import { getPlayerColor, getPlayerId } from "../utils/identity";
import { ResourceIcon } from "./Icons";
import {
  BaseLocationDisplay,
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
      buttonChildren={renderButtons(
        disabled || !canVisit,
        disabled || !canLeave,
        () => visitJourney(storedId, index, 1),
        () => visitJourney(storedId, index, -1),
      )}
      workerChildren={renderWorkers(journey)}
      resourceChildren={
        <>
          <ResourceIcon type={"cards"} /> {`-${journey.discardCount}`}
          {"→"}
          <ResourceIcon type={"coins"} /> {journey.value}
        </>
      }
    />
  );
}

function JourneysDisplay() {
  const { game } = useGame();

  return (
    <div className="flex gap-2">
      {game.journeys.map((journey: Journey, index: number) => (
        <JourneyDisplay journey={journey} index={index} />
      ))}
    </div>
  );
}

export default JourneysDisplay;
