import { useState } from "react";
import { COLORS } from "../colors";
import { Card, PlayerColor, ResourceType } from "../engine/gameTypes";
import { mapOverResources } from "../engine/helpers";
import CardInspect from "./CardInspect";
import { ResourceIcon, WorkerIcon } from "./Icons";
import { text } from "stream/consumers";

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
  const [inspecting, setInspecting] = useState(false);
  const [hovered, setHovered] = useState(false);

  let borderStyle: string;
  if (card?.discarding) {
    borderStyle = `2px solid ${COLORS.cardPreviewDiscarding}`;
  } else if (card?.playing) {
    borderStyle = `2px solid ${COLORS.cardPreviewPlaying}`;
  } else if (card?.giving) {
    borderStyle = `2px solid ${COLORS.cardPreviewGiving}`;
  } else {
    borderStyle = `2px solid ${COLORS.cardPreviewOutline}`;
  }

  const storable =
    card && (card.storage || card.maxDestinations != null) && placedDown;
  const textColor = card?.occupied ? COLORS.cardPreviewOccupied : COLORS.text;

  const isInteractive = card && onLeftClick;

  return (
    <div
      style={{
        width: "100px",
        height: storable ? "210px" : "170px",
        background: COLORS.cardPreview,
        border: borderStyle,
        padding: "4px",
        borderRadius: "4px",
        textAlign: "center",
        cursor: card && onLeftClick ? "pointer" : "default",
        flex: "0 0 auto",
        display: "flex",
        flexDirection: "column",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseDown={(e) => {
        if (e.button !== 0 || inspecting || onLeftClick === undefined) return;
        onLeftClick();
      }}
      onContextMenu={(e) => {
        e.preventDefault();
        setInspecting(true);
        setHovered(false);
      }}
    >
      {card ? (
        <>
          <div>
            <img
              src={require(`../assets/cards/${card.imageKey}.jpg`)}
              alt={card.name}
              style={{
                width: "100%",
                height: "150px",
                objectFit: "cover",
                borderRadius: "4px",
                display: "block",
                transition: "transform 0.1s ease, filter 0.1s ease",
                transform:
                  hovered && isInteractive ? "scale(1.02)" : "scale(1)",
                filter:
                  hovered && isInteractive
                    ? "brightness(1.05)"
                    : "brightness(1)",
              }}
              draggable={false}
            />
            <strong style={{ fontSize: "12px", color: textColor }}>
              {card.name}
            </strong>
          </div>

          {storable && (
            <div
              style={{
                background: COLORS.storage,
                flexGrow: 1,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-evenly",
                alignItems: "center",
                padding: "4px",
                borderRadius: "4px",
              }}
            >
              {card.storage &&
                mapOverResources(card.storage, (key, val) => (
                  <div key={key} style={{ fontSize: "10px" }}>
                    <ResourceIcon type={key as ResourceType} /> {val}
                  </div>
                ))}
              {card.workers.Red > 0 && (
                <div style={{ fontSize: "10px" }}>
                  <WorkerIcon playerColor={"Red"} /> {card.workers.Red}
                </div>
              )}
              {card.workers.Blue > 0 && (
                <div style={{ fontSize: "10px" }}>
                  <WorkerIcon playerColor={"Blue"} /> {card.workers.Blue}
                </div>
              )}
            </div>
          )}

          {inspecting && (
            <CardInspect
              card={card}
              index={index}
              cityColor={cityColor}
              onClose={() => setInspecting(false)}
              placedDown={placedDown}
            />
          )}
        </>
      ) : null}
    </div>
  );
}

export default CardPreview;
