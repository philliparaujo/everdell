import { PlayerColor, ResourceType } from "../engine/gameTypes";
import twig from "../assets/icons/twig.png";
import resin from "../assets/icons/resin.png";
import pebble from "../assets/icons/pebble.png";
import berry from "../assets/icons/berry.png";
import coin from "../assets/icons/coin.png";
import card from "../assets/icons/card.png";
import wildcard from "../assets/icons/wildcard.png";
import redworker from "../assets/icons/redworker.png";
import blueworker from "../assets/icons/blueworker.png";

const resourceIcons: Record<ResourceType, string> = {
  twigs: twig,
  resin: resin,
  pebbles: pebble,
  berries: berry,
  coins: coin,
  cards: card,
  wildcard: wildcard
}

export const iconStyle: React.CSSProperties = {
  width: '16px',
  height: '16px',
  verticalAlign: 'middle',
  marginLeft: '2px',
  marginRight: '2px'
};

export function ResourceIcon({ type }: { type: ResourceType }) {
  return (
    <img
      src={resourceIcons[type]}
      alt={type.toString()}
      style={iconStyle}
    />
  )
}

export function CustomResourceIcon({ path }: { path: string }) {
  return (
    <img
      src={path}
      alt={path}
      style={iconStyle}
    />
  )
}

export function WorkerIcon({ playerColor }: { playerColor: PlayerColor }) {
  return (
    <img
      src={playerColor === "Red" ? redworker : blueworker}
      alt={playerColor.toString()}
      style={iconStyle}
    />
  )
}