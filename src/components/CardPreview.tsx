import { useState } from "react";
import { Card, PlayerColor, ResourceType } from "../engine/gameTypes";
import { getCardPath } from "../utils/card";
import { countCharactersOnLocation, mapOverResources } from "../utils/loops";
import { styleCardPreviewBorderColor } from "../utils/tailwind";
import CardInspect from "./CardInspect";
import Hoverable from "./Hoverable";
import { ResourceIcon, WorkerIcon } from "./Icons";
import { renderPlacedCharacters } from "../utils/react";

function CardPreview({
  card,
  index,
  onLeftClick,
  location,
  cityColor,
  onDrop,
  isDropTarget = false,
}: {
  card: Card | null;
  index: number;
  onLeftClick?: () => void;
  location:
    | "hand"
    | "city"
    | "meadow"
    | "reveal"
    | "discard"
    | "farmStack"
    | "legends";
  cityColor: PlayerColor | null;
  onDrop?: (
    droppedCard: Card,
    sourceLocation: string,
    sourceIndex: number,
    targetIndex: number,
  ) => void;
  isDropTarget?: boolean;
}) {
  const storable =
    card &&
    (card.storage || card.maxDestinations != null) &&
    location === "city";
  const isInteractive = !!(card && onLeftClick);

  const textColor = card?.occupied
    ? "text-cardPreviewOutline-occupied"
    : "text-text";

  // Only allow dragging from playable locations (hand, meadow, discard, reveal)
  const isDraggable = !!card && location !== "city";
  const [dropping, setDropping] = useState<boolean>(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (!card) return;

    // Set the drag data
    e.dataTransfer.setData(
      "application/json",
      JSON.stringify({
        card,
        sourceLocation: location,
        sourceIndex: index,
      }),
    );

    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e: React.DragEvent) => {
    if (isDropTarget && !card) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";
      setDropping(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent) => {
    if (isDropTarget && !card) {
      e.preventDefault();
      setDropping(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    if (!isDropTarget || card || !onDrop) return;

    e.preventDefault();

    try {
      const dragData = JSON.parse(e.dataTransfer.getData("application/json"));
      const droppedCard: Card = dragData.card;
      const sourceLocation: string = dragData.sourceLocation;
      const sourceIndex: number = dragData.sourceIndex;

      // Only allow dropping if this is an empty slot
      if (!card) {
        onDrop(droppedCard, sourceLocation, sourceIndex, index);
        setDropping(false);
      }
    } catch (error) {
      console.error("Failed to parse drag data:", error);
    }
  };

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
            location={location}
          />
        )
      }
    >
      <div
        className={`w-[100px] rounded text-center border-2 flex-none flex flex-col bg-card-preview ${styleCardPreviewBorderColor(!!card?.discarding, !!card?.playing, !!card?.giving)}`}
        style={{
          height:
            storable || (card && countCharactersOnLocation(card) > 0)
              ? "210px"
              : "170px",
        }}
        draggable={isDraggable}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
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

            {(storable || countCharactersOnLocation(card) > 0) && (
              <div className="h-[40px] flex-shrink-0 flex flex-wrap justify-evenly items-center rounded-b bg-storage p-1 text-[10px]">
                {card.storage &&
                  mapOverResources(card.storage, (key, val) => (
                    <div key={key} className="flex items-center">
                      <ResourceIcon type={key as ResourceType} /> {val}
                    </div>
                  ))}
                {card.workers.Red > 0 && (
                  <div className="flex items-center">
                    <WorkerIcon playerColor={"Red"} /> {card.workers.Red}
                  </div>
                )}
                {card.workers.Blue > 0 && (
                  <div className="flex items-center">
                    <WorkerIcon playerColor={"Blue"} /> {card.workers.Blue}
                  </div>
                )}
                {renderPlacedCharacters(card)}
              </div>
            )}
          </>
        ) : (
          // Show drop zone indicator when empty and is drop target
          isDropTarget && (
            <div
              className={`flex-grow flex items-center justify-center text-gray-400 text-xs ${
                dropping ? "bg-highlight" : ""
              }`}
            ></div>
          )
        )}
      </div>
    </Hoverable>
  );
}

export default CardPreview;
