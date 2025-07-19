import { Power } from "../../engine/gameTypes";
import { defaultResources } from "../../engine/gameDefaults";

export const powers: Power[] = [
  {
    name: "Snails",
    title: "Steady",
    description:
      "During setup, draw 7 cards and place them in a facedown stack. When an opponent plays a green, you may give them a card from this stack to also activate the green for yourself.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Cats",
    title: "Bossy",
    description:
      "You may send a worker to any basic location, forest location, or red already occupied by an opponent.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Honey Bees",
    title: "Networkers",
    description:
      "Whenever you play a non-green Critter or Construction, you may discard 1 card to activate a green in your city. You may not use this ability when you are in autumn.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Bats",
    title: "Archivists",
    description:
      "Whenever you play a card, you may take 1 card from the Meadow and place it facedown in a stack by your city. You may play any card from this stack as though it were in your hand, the Meadow, or the Station.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "historian",
  },
  {
    name: "Pigs",
    title: "Master Farmers",
    description:
      "Begin the game with all Farm cards in a faceup stack in your area. At the beginning of each season, you may play the top Farm card for free (this does not count as your turn). Farms do not take up a space in your city. If an opponent plays a Farm, you gain 2 coins.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Stoats",
    title: "Planners",
    description:
      "After you play a Critter or Construction, you may discard 2 cards to gain 1 berry / twig / resin, or discard 3 cards to gain 1 pebble. This is not considered a card-playing ability.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "monk",
  },
  {
    name: "Butterflies",
    title: "Boundless",
    description:
      "Increase your hand limit by 4. Begin the game with 12 cards in your hand (11 cards if playing with 5 or 6 players). You are the first player.",
    handLimit: 10,
    startingHandSize: 5, // Assuming 2-3 players as a default
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Spiders",
    title: "Sneaky",
    description:
      "At the beginning of the game, place Nightweave spider on any worker location on the board. Whenever this location is visited, gain 1 wildcard you don't already have and draw 1 card, then move spider to a different location. You are the last player.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Turtles",
    title: "Patient Investors",
    description:
      "After you play a card and resolve its effect, you may place 1 wildcard here from your supply. If there is already a resource here, gain it and an additional resource of the same type from the general supply.",
    handLimit: null,
    startingHandSize: null,
    storage: { ...defaultResources },
    expansionName: "base",
    imageKey: "judge",
  },
  {
    name: "Squirrels",
    title: "Master Woodcrafters",
    description:
      "Any time you use a worker to gain at least 1 twig, gain 1 additional twig. When playing a construction, you may pay 2 twigs to replace 1 wildcard in the cost.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "woodcarver",
  },
  {
    name: "Mice",
    title: "Efficient Gatherers",
    description:
      "After you visit a Basic or Forest location, you may gain 1 wildcard that you do not already have.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "wife",
  },
  {
    name: "Hedgehogs",
    title: "Good Sniffers",
    description:
      "If you did not gain a berry when you placed a worker on a Basic or Forest location, gain 1 berry. When playing a Construction, you may pay 2 berries to replace 1 wildcard.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  // {
  //   name: "Foxes",
  //   title: "Trackers",
  //   description:
  //     "When you place a worker on a Forest location, instead of activating it you may activate any non-permanent location occupied by an opponent.",
  //   handLimit: null,
  //   startingHandSize: null,
  //   storage: null,
  //   expansionName: "base",
  //   imageKey: "ranger",
  // },
  {
    name: "Moles",
    title: "Diggers",
    description:
      "When you use a worker to gain resources from a location, you may pay up to 1 of these resources to gain a pebble.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "minermole",
  },
  {
    name: "Owls",
    title: "Wise",
    description:
      "Increase your hand limit by 1. After you place a worker and resolve the action, you may discard 1 card from your hand, and/or draw 1 card. You may keep this card or give it away to an opponent. Draw 2 cards if you give it away.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "shepherd",
  },
  // {
  //   name: "Lizards",
  //   title: "Wanderers",
  //   description:
  //     "Begin the game with the unused Forest locations in a shuffled facedown deck. At the beginning of each season, draw 3 and choose 1 to play in your area, placing the other 3 at the bottom of the deck. You alone may visit these Forest locations.",
  //   handLimit: null,
  //   startingHandSize: null,
  //   storage: null,
  //   expansionName: "base",
  //   imageKey: "wanderer",
  // },
  {
    name: "Toads",
    title: "Green Thumbs",
    description:
      "When you play a green, you may discard 1 card to activate that green again.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "bargetoad",
  },
  {
    name: "Otters",
    title: "Patchers",
    description:
      "When playing a Construction, you may use resin as any resource.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Platypuses",
    title: "Treasure Hunters",
    description:
      "At the beginning of the game, place 5 coins here. At any time on your turn, you may pay up to 1 of these coins to gain 1 wildcard and draw 1 card from the deck or the Meadow.",
    handLimit: null,
    startingHandSize: null,
    storage: { ...defaultResources },
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Axolotls",
    title: "Explorers",
    description:
      "At the beginning of the game, place 1 wildcard on each Basic location. Whenever you visit a Basic location, also gain the wildcard from that location.",
    handLimit: null,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Cardinals",
    title: "Scouts",
    description:
      "Increase your hand limit by 2. Any time you get to draw any number of cards, you may draw 1 additional card from the deck.",
    handLimit: 10,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Starlings",
    title: "Harmonious",
    description:
      "Increase your hand limit by 3. When you draw cards, you may draw from the deck or the Meadow. If you are required to 'reveal', they must be cards from the deck.",
    handLimit: 10,
    startingHandSize: null,
    storage: null,
    expansionName: "base",
    imageKey: "architect",
  },
  {
    name: "Rats",
    title: "Obnoxious",
    description:
      "At the beginning of the game, place Rugwort rat on any Meadow card. Whenever that card is played, gain 1 wildcard that you do not already have, then move rat to a different Meadow card.",
    handLimit: 10,
    startingHandSize: null,
    storage: null,
    expansionName: "rugwort",
    imageKey: "rugworttherowdy",
  },
];
