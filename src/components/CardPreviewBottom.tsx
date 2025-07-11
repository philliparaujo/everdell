import { Card, PlayerColor } from "../engine/gameTypes";
import { styleCardPreviewBorderColor } from "../utils/tailwind";
import CardInspect from "./CardInspect";
import Hoverable from "./Hoverable";

function CardPreviewBottom({
  card,
  index,
  onLeftClick,
  location,
  cityColor,
}: {
  card: Card | null;
  index: number;
  onLeftClick?: () => void;
  location: "hand" | "city" | "meadow" | "reveal" | "discard" | "legends";
  cityColor: PlayerColor | null;
}) {
  const isInteractive = !!(card && onLeftClick);
  const textColor = card?.occupied
    ? "text-cardPreviewOutline-occupied"
    : "text-text";

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
        className={`w-[100px] text-center border-2 flex-none flex flex-col bg-card-preview ${styleCardPreviewBorderColor(!!card?.discarding, !!card?.playing, !!card?.giving)}`}
      >
        {
          <div className="flex-grow flex flex-col">
            <div
              className={`text-[11px] leading-tight font-bold ${textColor} flex-grow flex items-center justify-center`}
            >
              {card?.below === "Dungeon" ? <s>{card.name}</s> : card?.name}
            </div>
          </div>
        }
      </div>
    </Hoverable>
  );
}

export default CardPreviewBottom;
