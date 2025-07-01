import {
  EffectType,
  GameState,
  Player,
  PlayerCount,
  ResourceCount,
  ResourceType,
  Workers,
} from "./gameTypes";

export const defaultPlayerCount: PlayerCount = {
  Red: 0,
  Blue: 0,
};

export const defaultEffectTypeCount: Record<EffectType, number> = {
  Blue: 0,
  Green: 0,
  Purple: 0,
  Red: 0,
  Tan: 0,
};

export const defaultResources: ResourceCount = {
  twigs: 0,
  resin: 0,
  pebbles: 0,
  berries: 0,
  coins: 0,
  cards: 0,
  wildcards: 0,
};

export const defaultWorkers: Workers = {
  workersLeft: 2,
  maxWorkers: 2,
};

export const defaultPlayer: Player = {
  name: "",
  id: "",
  color: "Red",
  hand: [],
  city: [],
  resources: defaultResources,
  workers: defaultWorkers,
  season: "Winter",

  discarding: false,
  playing: false,
  giving: false,
  revealingDeck: false,
  revealingDiscard: false,

  history: {
    discarded: [],
    cityDiscarded: [],
    drew: [],
    played: [],
    gave: [],

    resources: defaultResources,
    workers: defaultWorkers,
    season: "Winter",
  },
};

export const defaultGameState: GameState = {
  players: {
    Red: defaultPlayer,
    Blue: defaultPlayer,
  },
  deck: [],
  discard: [],
  meadow: [],
  reveal: [],
  locations: [],
  journeys: [],
  events: [],
  specialEvents: [],
  turn: "Red",
};

export const RESOURCE_ORDER: ResourceType[] = [
  "twigs",
  "resin",
  "pebbles",
  "berries",
  "coins",
  "cards",
  "wildcards",
];

export const EFFECT_ORDER: EffectType[] = [
  "Blue",
  "Green",
  "Purple",
  "Red",
  "Tan",
];
