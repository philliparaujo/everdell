
import bluetype from "../assets/transparent-icons/bluetype.png";
import greentype from "../assets/transparent-icons/greentype.png";
import purpletype from "../assets/transparent-icons/purpletype.png";
import redtype from "../assets/transparent-icons/redtype.png";
import tantype from "../assets/transparent-icons/tantype.png";
import twig from "../assets/transparent-icons/twig.png";
import resin from "../assets/transparent-icons/resin.png";
import pebble from "../assets/transparent-icons/pebble.png";
import berry from "../assets/transparent-icons/berry.png";
import coin from "../assets/transparent-icons/coin.png";
import card from "../assets/transparent-icons/card.png";
import wildcard from "../assets/transparent-icons/wildcard.png";
import redworker from "../assets/transparent-icons/redworker.png";
import blueworker from "../assets/transparent-icons/blueworker.png";
import { EffectType, PlayerColor, ResourceType } from "../engine/gameTypes";

// Icons mappings
const effectTypeIcons: Record<EffectType, string> = {
  Blue: bluetype,
  Green: greentype,
  Purple: purpletype,
  Red: redtype,
  Tan: tantype
}

const resourceIcons: Record<ResourceType, string> = {
  twigs: twig,
  resin: resin,
  pebbles: pebble,
  berries: berry,
  coins: coin,
  cards: card,
  wildcard: wildcard
}

// Styling
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

export function EffectTypeIcon({ type }: { type: EffectType }) {
  return (
    <img
      src={effectTypeIcons[type]}
      alt={type.toString()}
      style={iconStyle}
    />
  )
}