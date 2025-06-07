import { useGame } from "../engine/GameContext";
import { Journey } from "../engine/gameTypes";
import { getPlayerId, isNotYourTurn } from "../engine/helpers";
import { ResourceIcon } from "./Icons";
import { arrowResourceStyling, BaseLocationDisplay, locationsDisplayStyling, renderButtons, renderWorkers } from "./LocationsDisplay";

function JourneyDisplay({ journey, index }: { journey: Journey, index: number }) {
  const { game, visitJourney } = useGame();

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

  return (
    <BaseLocationDisplay
      exclusive={journey.exclusive}
      buttonChildren={
        renderButtons(
          disabled,
          disabled,
          () => visitJourney(storedId, index, 1),
          () => visitJourney(storedId, index, -1)
        )
      }
      workerChildren={renderWorkers(journey)}
      resourceChildren={(
        <div style={arrowResourceStyling}>
          <ResourceIcon type={"cards"} /> {`-${journey.discardCount}`}
          {"→"}
          <ResourceIcon type={"coins"} /> {journey.value}
        </div>
      )}
    />
  )
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