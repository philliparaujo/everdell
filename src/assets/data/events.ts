import { Event } from "../../engine/gameTypes";

export const events: Omit<Event, "used" | "workers">[] = [
  {
    name: "City Monument",
    value: 3,
    effectTypeRequirement: "Blue",
    effectTypeCount: 3,
  },
  {
    name: "Grand Tour",
    value: 3,
    effectTypeRequirement: "Red",
    effectTypeCount: 3,
  },
  {
    name: "Harvest Festival",
    value: 3,
    effectTypeRequirement: "Green",
    effectTypeCount: 4,
  },
  {
    name: "Cartographer's Expedition",
    value: 3,
    effectTypeRequirement: "Tan",
    effectTypeCount: 3,
  },
];
