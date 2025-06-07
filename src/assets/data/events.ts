import { Event } from "../../engine/gameTypes";

export const events: Event[] = [
  {
    name: "City Monument",
    value: 3,
    effectTypeRequirement: "Blue",
    effectTypeCount: 3,
    workers: { Red: 0, Blue: 0 },
    used: false,
  },
  {
    name: "Grand Tour",
    value: 3,
    effectTypeRequirement: "Red",
    effectTypeCount: 3,
    workers: { Red: 0, Blue: 0 },
    used: false,
  },
  {
    name: "Harvest Festival",
    value: 3,
    effectTypeRequirement: "Green",
    effectTypeCount: 4,
    workers: { Red: 0, Blue: 0 },
    used: false,
  },
  {
    name: "Cartographer's Expedition",
    value: 3,
    effectTypeRequirement: "Tan",
    effectTypeCount: 3,
    workers: { Red: 0, Blue: 0 },
    used: false,
  },
];
