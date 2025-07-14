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
export type ResourceCount = Record<ResourceType, number>;

export type CharacterType = "Rat" | "Spider";
export type CharacterCount = Record<CharacterType, number>;

export type PlayerColor = "Red" | "Blue";
export type PlayerCount = Record<PlayerColor, number>;

export type ExpansionName = "base" | "extra extra" | "legends" | "rugwort";
export const EXPANSION_NAMES: ExpansionName[] = [
  "base",
  "extra extra",
  "legends",
  "rugwort",
];

export type Action = "discarding" | "playing" | "giving";
export type Card = {
  name: string;
  cost: ResourceCount;
  value: number;
  cardType: CardType;
  effectType: EffectType;
  unique: boolean;
  description: string;

  // Image path is assets/cards/expansionName/imageKey.jpg
  expansionName: ExpansionName;
  imageKey: string;

  // Constructions can be occupied to play free critters
  // Some critters can be used to play free Legends cards
  // Constructions of a specific type can be used to play free Rugwort cards
  occupied: boolean | null; // For constructions
  cardNameFreeBonus: string | null; // For critters
  effectTypeFreeBonus: EffectType[] | null; // For Rugwort cards

  // Some Legends cards can be placed below a card
  below: string | null;

  // Some cards can be visited by workers
  activeDestinations: number | null;
  maxDestinations: number | null;
  workers: PlayerCount;

  // Some cards can store resources or coins on them
  storage: ResourceCount | null;

  // Actions
  discarding: boolean;
  playing: boolean;
  giving: boolean;
};

export type Power = {
  name: string;
  description: string;
  handLimit: number | null;
  startingHandSize: number | null;
  storage: ResourceCount | null;

  // Image path is assets/cards/expansionName/imageKey.jpg
  expansionName: ExpansionName;
  imageKey: string;
};

export type Location = {
  exclusive: boolean;
  resources: ResourceCount;
  workers: PlayerCount;
  storage: ResourceCount | null; // Only for certain powers
  characters: CharacterCount | null; // Only for certain powers
};

export type Journey = {
  exclusive: boolean;
  discardCount: number;
  value: number;
  workers: PlayerCount;
};

export type Event = {
  name: string;
  value: number;
  effectTypeRequirement: EffectType;
  effectTypeCount: number;
  workers: PlayerCount;
  used: boolean;
};

export type SpecialEvent = {
  name: string;
  cardRequirement: string[];
  effectTypeRequirement: Record<EffectType, number>;
  workers: PlayerCount;
  used: boolean;

  specialDescription: string | null;
  specialReward: string | null;

  value: number | null;
};

// Only share workers field
export type Visitable = Location | Journey | Event | SpecialEvent | Card;

export type Workers = {
  workersLeft: number;
  maxWorkers: number;
};

export type History = {
  // This turn
  discarded: Card[];
  cityDiscarded: Card[];
  drew: Card[];
  played: Card[];
  gave: Card[];

  // From last turn
  resources: ResourceCount;
  workers: Workers;
  season: Season;
};

export type Player = {
  name: string;
  id: string;
  color: PlayerColor;
  hand: Card[];
  city: Card[];
  resources: ResourceCount;
  workers: Workers;
  season: Season;
  legends: Card[]; // Only in Legends expansion
  power: Power | null; // Only with powers enabled

  discarding: boolean;
  playing: boolean;
  giving: boolean;

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
  previousState: GameState | null;
  activeExpansions: ExpansionName[];
};
