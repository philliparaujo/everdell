import { PlayerColor } from "./engine/gameTypes";

// Base Hues (adjust slightly for your preference)
const darkBackground = "#1A1A1A"; // Very dark grey, slightly darker than #222 for more depth
const mediumBackground = "#2A2A2A"; // A slightly lighter grey for differentiation (e.g., sidebar)
const lightText = "#E0E0E0"; // Softer white for general text, reduces eye strain
const subtleAccent = "#555555"; // Darker, less obtrusive accent grey

export const COLORS = {
  // General
  background: darkBackground,
  text: lightText,
  colorScheme: "dark",

  // Player Colors (slightly desaturated/darker to fit dark theme)
  red: "#FF1C1C", // A slightly muted red
  blue: "#2478FF", // A vibrant but not overpowering blue
  green: "#2ECC71", // A pleasant green (if you add green players)
  yellow: "#F1C40F", // A warm, clear yellow (if you add yellow players)
  purple: "#9B59B6", // Example additional player color
  orange: "#E67E22", // Example additional player color

  // Sidebar
  sidebar: mediumBackground, // Differentiates from main background
  sidebarBorder: subtleAccent, // Softer border

  // Seasons (giving them distinct, thematic, and muted colors)
  seasonWinter: "#A7C7E7", // Muted light blue/grey for cold
  seasonSpring: "#8BC681", // Muted light green for new growth
  seasonSummer: "#FFD74D", // Muted warm orange/yellow for sun
  seasonFall: "#D0A25D", // Muted earthy brown/orange for autumn leaves

  // Play area
  playArea: darkBackground, // Consistent with main background

  // Locations (using a subtle accent or slightly lighter background)
  location: mediumBackground, // Makes locations stand out subtly
  locationExclusive: "#8A8A8A", // A slightly darker shade for exclusive locations

  // Card Previews/Inspect
  cardPreview: darkBackground, // Keep consistent
  cardPreviewOutline: subtleAccent, // Softer outline
  cardPreviewDiscarding: "#C0392B", // A deeper, more serious red for discarding
  cardPreviewPlaying: "#27AE60", // A deeper, more committed green for playing
  cardPreviewGiving: "#FFCC00",
  storage: mediumBackground, // Consistent with sidebar/location accents

  cardInspect: mediumBackground, // Slightly lighter background for the modal
  cardInspectBackground: "rgba(0, 0, 0, 0.8)", // More opaque overlay
  cardInspectImageBorder: "#444", // A slightly visible border for images

  // Button
  buttonBorder: subtleAccent, // Soft border for buttons
  buttonColor: "#444", // A dark grey for button background
  buttonText: lightText, // Use the softened light text color

  importantButton: "#484", // Gold-like yellow for emphasis
  rareButton: "#a60",
};

export const PLAYER_COLORS: Record<PlayerColor, string> = {
  Red: COLORS.red,
  Blue: COLORS.blue,
};
