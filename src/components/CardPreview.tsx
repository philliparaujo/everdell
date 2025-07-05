import { Card, PlayerColor, ResourceType } from "../engine/gameTypes";
import { getCardPath } from "../utils/card";
import { mapOverResources } from "../utils/loops";
import { styleCardPreviewBorderColor } from "../utils/tailwind";
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
  const storable =
    card && (card.storage || card.maxDestinations != null) && placedDown;
  const textColor = card?.occupied
    ? "text-cardPreviewOutline-occupied"
    : "text-text";

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
        className={`w-[100px] rounded text-center border-2 flex-none flex flex-col bg-card-preview ${styleCardPreviewBorderColor(!!card?.discarding, !!card?.playing, !!card?.giving)}`}
        style={{
          height: storable ? "210px" : "170px",
        }}
      >
        {card ? (
          <>
            <div className="flex-grow flex flex-col">
              <img
                src={require(
                  `../${getCardPath(card.expansionName, card.imageKey)}`,
                )}
                alt={card.name}
                className="w-full p-0 pb-0 h-[138px] object-cover rounded-t flex-shrink-0"
                draggable={false}
              />
              <div
                className={`text-[11px] leading-tight font-bold ${textColor} flex-grow flex items-center justify-center`}
              >
                {card.name}
              </div>
            </div>

            {storable && (
              <div className="h-[40px] flex-shrink-0 flex flex-wrap justify-evenly items-center rounded-b bg-storage p-1">
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
