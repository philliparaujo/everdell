import berry from "../assets/transparent-icons/berry.png";
import bluetype from "../assets/transparent-icons/bluetype.png";
import blueworker from "../assets/transparent-icons/blueworker.png";
import card from "../assets/transparent-icons/card.png";
import coin from "../assets/transparent-icons/coin.png";
import greentype from "../assets/transparent-icons/greentype.png";
import pebble from "../assets/transparent-icons/pebble.png";
import purpletype from "../assets/transparent-icons/purpletype.png";
import redtype from "../assets/transparent-icons/redtype.png";
import redworker from "../assets/transparent-icons/redworker.png";
import resin from "../assets/transparent-icons/resin.png";
import tantype from "../assets/transparent-icons/tantype.png";
import twig from "../assets/transparent-icons/twig.png";
import wildcard from "../assets/transparent-icons/wildcard.png";
import rat from "../assets/transparent-icons/rat.png";
import spider from "../assets/transparent-icons/spider.png";
import {
  CharacterType,
  EffectType,
  PlayerColor,
  ResourceType,
} from "../engine/gameTypes";

// Icon mappings
const effectTypeIcons: Record<EffectType, string> = {
  Blue: bluetype,
  Green: greentype,
  Purple: purpletype,
  Red: redtype,
  Tan: tantype,
};

const resourceIcons: Record<ResourceType, string> = {
  twigs: twig,
  resin: resin,
  pebbles: pebble,
  berries: berry,
  coins: coin,
  cards: card,
  wildcards: wildcard,
};

const workerIcons: Record<PlayerColor, string> = {
  Red: redworker,
  Blue: blueworker,
};

const characterIcons: Record<CharacterType, string> = {
  rat: rat,
  spider: spider,
};

// Icon components
export function EffectTypeIcon({ type }: { type: EffectType }) {
  return (
    <img
      src={effectTypeIcons[type]}
      alt={type.toString()}
      className="w-4 h-4 mx-0.5 align-middle inline-block"
    />
  );
}

export function ResourceIcon({ type }: { type: ResourceType }) {
  return (
    <img
      src={resourceIcons[type]}
      alt={type.toString()}
      className="w-4 h-4 mx-0.5 align-middle inline-block"
    />
  );
}

export function WorkerIcon({ playerColor }: { playerColor: PlayerColor }) {
  return (
    <img
      src={workerIcons[playerColor]}
      alt={playerColor.toString()}
      className="w-4 h-4 mx-0.5 align-middle inline-block"
    />
  );
}

export function CharacterIcon({ character }: { character: CharacterType }) {
  return (
    <img
      src={characterIcons[character]}
      alt={character.toString()}
      className="w-4 h-4 mx-0.5 align-middle inline-block"
    />
  );
}

export function CustomResourceIcon({ path }: { path: string }) {
  return (
    <img
      src={path}
      alt={path}
      className="w-4 h-4 mx-0.5 align-middle inline-block"
    />
  );
}
