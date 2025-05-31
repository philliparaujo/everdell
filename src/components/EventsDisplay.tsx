import { useGame } from "../engine/GameContext";
import { Event } from "../engine/gameTypes";
import { getPlayerId, isNotYourTurn } from "../engine/helpers";
import { EffectTypeIcon, ResourceIcon, WorkerIcon } from "./Icons";

function EventDisplay({ event, index }: { event: Event, index: number }) {
  const { game, visitEvent } = useGame();

  const storedId = getPlayerId();
  const disabled = isNotYourTurn(game, storedId);

  return (
    <div style={{
      width: '100px',
      height: '100px',
      background: '#DCBA9E',
      padding: '4px',
      borderRadius: '8px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      alignItems: 'center',
      textAlign: 'center'
    }}>
      <div>
        <button disabled={disabled} onClick={() => visitEvent(storedId, index, 1)}>
          Visit
        </button>
      </div>
      <div>
        <button disabled={disabled} onClick={() => visitEvent(storedId, index, -1)}>
          Unvisit
        </button>
      </div>

      <div style={{
        display: 'flex', height: '25px', alignContent: 'center', gap: '8px'
      }}>
        {event.workers.Red > 0 && (
          <span><WorkerIcon playerColor={"Red"} /> {event.workers.Red}</span>
        )}
        {event.workers.Blue > 0 && (
          <span><WorkerIcon playerColor={"Blue"} /> {event.workers.Blue}</span>
        )}
      </div>

      <div style={{ justifyContent: 'center' }}>
        <div>
          <EffectTypeIcon type={event.effectTypeRequirement} /> {event.effectTypeCount}
        </div>
        <div>
          <ResourceIcon type={"coins"} /> {event.value}
        </div>
      </div>
    </div>
  )
}

function EventsDisplay() {
  const { game } = useGame();

  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '16px' }}>
      {game.events.map((event: Event, index: number) => (
        <EventDisplay event={event} index={index} />
      ))}
    </div>
  );
}

export default EventsDisplay;