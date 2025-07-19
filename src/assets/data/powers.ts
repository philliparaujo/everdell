import { Power } from "../../engine/gameTypes";
import { defaultResources } from "../../engine/gameDefaults";

export const powers: Power[] = [
  {
    name: "Snails",
    description:
      "During Setup, draw 3 cards and place them on this from the deck. You may play these cards as if they were in your hand.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Cats",
    description:
      "Whenever you play a cute green Critter or Construction, you may place 1 of your workers from the supply on it if it is occupied.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Honey Bees",
    description:
      "Whenever you play a cute green Critter or Construction, you may place 1 berry on this from the supply. You may use this ability when you are in your hand.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Bats",
    description:
      "Whenever you play a card, you may pay 2 berries to discard all cards in the Meadow and draw 8 new cards to it. You may play one card from the stack as though it were in your hand. You may use this ability when you are in your hand.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "historian",
  },
  {
    name: "Pigs",
    description:
      "Begin the game with all 6 of your workers. At the beginning of each season, you do not gain a worker. If an opponent plays a Farm, you gain 1 berry.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Stoats",
    description:
      "After you play a Critter or Construction, you may give an opponent 1 of your cards to gain 1 of any resource.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "monk",
  },
  {
    name: "Butterflies",
    description:
      "Increase your hand limit by 2. Draw your first hand. Begin the game with 4 (1 player), 5 (2-3 players), or 6 (4 players) cards.",
    handLimit: 10,
    startingHandSize: 5, // Assuming 2-3 players as a default
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Spiders",
    description: "You are the first player.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Turtles",
    description:
      "You may place 1 of any resource on this from the supply. At any time, you may use this resource as if it were in your supply. When placing an additional worker, you may pay 2 of any resource to place 1 of the workers from the general supply.",
    handLimit: null,
    startingHandSize: null,
    storage: { ...defaultResources },
    expansionName: "base",
    imageKey: "judge",
  },
  {
    name: "Squirrels",
    description:
      "After you visit a Basic or Forest location, you may play a card. You do not gain the resources/cards from the location.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "woodcarver",
  },
  {
    name: "Mice",
    description:
      "After you visit a Basic or Forest location, you may play 1 card. You do not gain the resources/cards from the location.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "wife",
  },
  {
    name: "Hedgehogs",
    description:
      "If you did not gain a card when you placed a worker this season, you may play a Construction. You may pay 1 berry to deploy a worker instead.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Foxes",
    description:
      "When you place a worker on a Forest location, you may draw a card from the deck. You may not visit a non-permanent location occupied by an opponent.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "ranger",
  },
  {
    name: "Moles",
    description:
      "When you play a Critter, you may gain 1 of any resource from a location. You may pay up to 2 of those resources to gain 2 berries.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "minermole",
  },
  {
    name: "Owls",
    description:
      "When you play a Critter, you may draw a card. You may keep this or give a card to an opponent to draw 2 cards. You may play a card from your hand instead.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "shepherd",
  },
  {
    name: "Lizards",
    description:
      "At the beginning of the second clock turn, draw 1 card. At the beginning of each season, draw 1 card. Once per season, you may place one of your workers on a Forest location to gain 1 of any resource.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "wanderer",
  },
  {
    name: "Toads",
    description:
      "When you play a card, you may discard 1 card to activate it again.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "bargetoad",
  },
  {
    name: "Otters",
    description:
      "When playing a Construction, you may pay 1 of any resource to replace 1 of its costs.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Platypuses",
    description:
      "At the beginning of the game, place 2 coins on this. At any time, you may pay up to 1 of these to gain 1 of any resource. You may pay up to 1 of these to gain 1 of any resource.",
    handLimit: null,
    startingHandSize: null,
    storage: { ...defaultResources },
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Axolotls",
    description:
      "At the beginning of the game, draw 1 card for each Basic Production card you have. Whenever you play a Basic Production card, you may gain 1 of its resources from that location.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Cardinals",
    description:
      "Increase your hand limit by 2. Any time you play a card, you may draw 1 card from the deck.",
    handLimit: 10,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Starlings",
    description:
      "Increase your hand limit by 2. When you draw cards, you may draw from the deck or the Meadow. If you are required to 'draw', you may draw from the deck.",
    handLimit: 10,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Rats",
    description:
      "Increase your hand limit by 2. When you draw cards, you may draw from the deck or the Meadow. If you are required to 'draw', you may draw from the deck.",
    handLimit: 10,
    startingHandSize: null,
    storage: null,
    expansionName: "rugwort",
    imageKey: "rugworttherowdy",
  },
];
