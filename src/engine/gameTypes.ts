export type CardType = "Construction" | "Critter";
export type EffectType = "Blue" | "Green" | "Purple" | "Red" | "Tan";

export type Season = "Winter" | "Spring" | "Summer" | "Autumn";

export type ResourceType =
  | "twigs"
  | "resin"
  | "pebbles"
  | "berries"
  | "coins"
  | "cards"
  | "wildcards";
export type Resources = Record<ResourceType, number>;

export type Workers = {
  workersLeft: number;
  maxWorkers: number;
};

export type Card = {
  name: string;
  cost: Resources;
  value: number;
  cardType: CardType;
  effectType: EffectType;
  unique: boolean;
  description: string;

  imageKey: string;

  occupied: boolean | null; // Constructions can be occupied to play free critters
  constructionRequirement: string | null; // Critters can be played for free by occupying constructions

  // Some cards can be visited by workers
  activeDestinations: number | null;
  maxDestinations: number | null;
  workers: Record<PlayerColor, number>;

  storage: Resources | null; // Some cards can store resources or coins on them

  discarding: boolean;
  playing: boolean;
  giving: boolean;
};

export type Location = {
  exclusive: boolean;
  resources: Resources;
  workers: Record<PlayerColor, number>;
};

export type Journey = {
  exclusive: boolean;
  discardCount: number;
  value: number;
  workers: Record<PlayerColor, number>;
};

export type Event = {
  name: string;
  value: number;
  effectTypeRequirement: EffectType;
  effectTypeCount: number;
  workers: Record<PlayerColor, number>;
  used: boolean;
};

export type SpecialEvent = {
  name: string;
  cardRequirement: string[];
  effectTypeRequirement: Record<EffectType, number>;
  workers: Record<PlayerColor, number>;
  used: boolean;

  specialDescription: string | null;
  specialReward: string | null;

  value: number | null;
};

export type History = {
  // This turn
  discarded: Card[];
  cityDiscarded: Card[];
  drew: Card[];
  played: Card[];
  gave: Card[];

  // From last turn
  resources: Resources;
  workers: Workers;
  season: Season;
};

export type PlayerColor = "Red" | "Blue";
export type Player = {
  name: string;
  id: string;
  color: PlayerColor;
  hand: Card[];
  city: Card[];
  resources: Resources;
  workers: Workers;
  season: Season;

  discarding: boolean;
  playing: boolean;
  giving: boolean;
  revealingDeck: boolean;
  revealingDiscard: boolean;

  history: History;
};

export type GameState = {
  players: Record<PlayerColor, Player>;
  deck: Card[];
  discard: Card[];
  meadow: Card[];
  reveal: Card[];
  locations: Location[];
  journeys: Journey[];
  events: Event[];
  specialEvents: SpecialEvent[];
  turn: PlayerColor;
};

export const defaultResources: Resources = {
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
