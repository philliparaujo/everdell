import { defaultPlayerCount } from "../../engine/gameDefaults";
import { Journey } from "../../engine/gameTypes";

export const journeys: Journey[] = [
  {
    exclusive: false,
    discardCount: 2,
    value: 2,
    workers: defaultPlayerCount,
  },
  {
    exclusive: true,
    discardCount: 3,
    value: 3,
    workers: defaultPlayerCount,
  },
  {
    exclusive: true,
    discardCount: 4,
    value: 4,
    workers: defaultPlayerCount,
  },
  {
    exclusive: true,
    discardCount: 5,
    value: 5,
    workers: defaultPlayerCount,
  },
];
