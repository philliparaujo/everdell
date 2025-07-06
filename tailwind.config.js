/** @type {import('tailwindcss').Config} */

const SIDEBAR_WIDTH = 260;

const darkBackground = "#1A1A1A";
const mediumDarkBackground = "#212121";
const mediumBackground = "#2A2A2A";
const lightBackground = "#444";
const inspectBackground = "rgba(0, 0, 0, 0.8)";

const lightText = "#E0E0E0";
const subtleAccent = "#555555";

module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: darkBackground,
        text: lightText,
        "play-area": darkBackground,
        "card-preview": darkBackground,
        log: mediumDarkBackground,
        container: mediumBackground,
        storage: mediumBackground,
        inspect: mediumBackground,
        "container-border": subtleAccent,
        "button-border": subtleAccent,
        "button-text": lightText,
        navigation: "#ABA3FF",
        player: {
          red: "#FF1C1C",
          blue: "#2478FF",
          green: "#2ECC71",
          yellow: "#F1C40F",
        },
        season: {
          winter: "#A7C7E7",
          spring: "#8BC681",
          summer: "#FFD74D",
          autumn: "#D0A25D",
        },
        location: {
          default: mediumBackground,
          exclusive: "#8A8A8A",
          used: "#DD8A8A",
        },
        cardPreviewOutline: {
          default: subtleAccent,
          discarding: "#C0392B",
          playing: "#27AE60",
          giving: "#FFCC00",
          occupied: "#BB88DD",
        },
        button: {
          default: lightBackground,
          important: "#363",
          rare: "#950",
          danger: "#844",
        },
        "inspect-background": inspectBackground,
        highlight: "rgba(255, 220, 0, 0.3)",
      },
      fontFamily: {
        sans: [
          "Arial",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "Noto Sans",
          "sans-serif",
        ],
      },
      width: {
        sidebar: `${SIDEBAR_WIDTH}px`,
      },
      spacing: {
        sidebar: `${SIDEBAR_WIDTH}px`,
      },
    },
  },
  plugins: [],
};
