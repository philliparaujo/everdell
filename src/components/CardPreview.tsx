import { COLORS } from "../colors";
import { Card, PlayerColor, ResourceType } from "../engine/gameTypes";
import { mapOverResources } from "../engine/helpers";
import CardInspect from "./CardInspect";
import Hoverable from "./Hoverable";
import { ResourceIcon, WorkerIcon } from "./Icons";

function CardPreview({
  card,
  index,
  onLeftClick,
  placedDown,
  cityColor,
}: {
  card: Card | null;
  index: number;
  onLeftClick?: () => void;
  placedDown: boolean;
  cityColor: PlayerColor | null;
}) {
  let borderStyle: string;
  if (card?.discarding) {
    borderStyle = `2px solid ${COLORS.cardPreviewDiscarding}`;
  } else if (card?.playing) {
    borderStyle = `2px solid ${COLORS.cardPreviewPlaying}`;
  } else if (card?.giving) {
    borderStyle = `2px solid ${COLORS.cardPreviewGiving}`;
  } else {
    borderStyle = `2px solid ${COLORS.cardPreviewBorder}`;
  }

  const storable =
    card && (card.storage || card.maxDestinations != null) && placedDown;
  const textColor = card?.occupied ? COLORS.cardPreviewOccupied : COLORS.text;

  const isInteractive = !!(card && onLeftClick);

  return (
    <Hoverable
      isInteractive={isInteractive}
      onLeftClick={onLeftClick}
      onRightClick={(closeInspector) =>
        card && (
          <CardInspect
            card={card}
            index={index}
            cityColor={cityColor}
            onClose={closeInspector}
            placedDown={placedDown}
          />
        )
      }
    >
      <div
        className="w-[100px] rounded text-center flex-none flex flex-col"
        style={{
          height: storable ? "210px" : "170px",
          background: COLORS.cardPreview,
          border: borderStyle,
        }}
      >
        {card ? (
          <>
            <div>
              <img
                src={require(`../assets/cards/${card.imageKey}.jpg`)}
                alt={card.name}
                className="w-full p-0 pb-0 h-[150px] object-cover rounded-t"
                draggable={false}
              />
              <p className="text-xs font-bold" style={{ color: textColor }}>
                {card.name}
              </p>
            </div>

            {storable && (
              <div
                className="flex-grow flex flex-wrap justify-evenly items-center rounded"
                style={{
                  background: COLORS.storage,
                }}
              >
                {card.storage &&
                  mapOverResources(card.storage, (key, val) => (
                    <div key={key} className="flex items-center text-[10px]">
                      <ResourceIcon type={key as ResourceType} /> {val}
                    </div>
                  ))}
                {card.workers.Red > 0 && (
                  <div className="flex items-center text-[10px]">
                    <WorkerIcon playerColor={"Red"} /> {card.workers.Red}
                  </div>
                )}
                {card.workers.Blue > 0 && (
                  <div className="flex items-center text-[10px]">
                    <WorkerIcon playerColor={"Blue"} /> {card.workers.Blue}
                  </div>
                )}
              </div>
            )}
          </>
        ) : null}
      </div>
    </Hoverable>
  );
}

export default CardPreview;
