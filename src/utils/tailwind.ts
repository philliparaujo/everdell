import { PlayerColor, Season } from "../engine/gameTypes";

export function stylePlayerColor(color: PlayerColor): string {
  return `text-player-${color.toLowerCase()}`;
}

// Cannot do text-season-${season.toLowerCase()} for compile reasons
export function styleSeasonColor(season: Season): string {
  switch (season) {
    case "Winter":
      return "text-season-winter";
    case "Spring":
      return "text-season-spring";
    case "Summer":
      return "text-season-summer";
    case "Autumn":
      return "text-season-autumn";
  }
}

export function styleLocationBorderColor(
  used: boolean,
  exclusive: boolean,
): string {
  if (used) {
    return "border-location-used";
  }
  if (exclusive) {
    return "border-location-exclusive";
  }
  return "border-location-default";
}

export function styleCardPreviewBorderColor(
  discarding: boolean,
  playing: boolean,
  giving: boolean,
): string {
  if (discarding) {
    return "border-cardPreviewOutline-discarding";
  }
  if (playing) {
    return "border-cardPreviewOutline-playing";
  }
  if (giving) {
    return "border-cardPreviewOutline-giving";
  }
  return "border-cardPreviewOutline-default";
}
