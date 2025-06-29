import { PlayerColor } from "./engine/gameTypes";

// Base Hues (adjust slightly for your preference)
const darkBackground = "#1A1A1A";
const mediumBackground = "#2A2A2A";
const lightBackground = "#444";
const inspectBackground = "rgba(0, 0, 0, 0.8)";

const lightText = "#E0E0E0";
const subtleAccent = "#555555";

export const COLORS = {
  // General
  background: darkBackground,
  text: lightText,
  colorScheme: "dark",

  // Component main colors
  playArea: darkBackground,
  cardPreview: darkBackground,

  container: mediumBackground,
  location: mediumBackground,
  storage: mediumBackground,
  inspect: mediumBackground,

  buttonColor: lightBackground,

  // Component borders
  containerBorder: subtleAccent,
  cardPreviewBorder: subtleAccent,
  buttonBorder: subtleAccent,

  // Component text
  buttonText: lightText,
  navigationText: "#ABA3FF",

  // Player Colors
  red: "#FF1C1C",
  blue: "#2478FF",
  green: "#2ECC71",
  yellow: "#F1C40F",

  // Seasons
  seasonWinter: "#A7C7E7",
  seasonSpring: "#8BC681",
  seasonSummer: "#FFD74D",
  seasonFall: "#D0A25D",

  // Location alternate borders
  locationExclusive: "#8A8A8A",
  locationUsed: "#DD8A8A",

  // Card Preview alternate borders
  cardPreviewDiscarding: "#C0392B",
  cardPreviewPlaying: "#27AE60",
  cardPreviewGiving: "#FFCC00",
  cardPreviewOccupied: "#BB88DD",

  // Button alternate colors
  importantButton: "#363",
  rareButton: "#950",
  dangerButton: "#844",

  // Card inspect
  inspectBackground: inspectBackground,
};

export const PLAYER_COLORS: Record<PlayerColor, string> = {
  Red: COLORS.red,
  Blue: COLORS.blue,
};
