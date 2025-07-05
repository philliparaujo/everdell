import { GameState, PlayerColor } from "../engine/gameTypes";

const PLAYER_NAME_KEY = "playerName";
const PLAYER_ID_KEY = "playerId";
const CARD_FREQUENCIES_KEY = "cardFrequencies";

export function storePlayerName(name: string) {
  console.log("Storing", name);
  sessionStorage.setItem(PLAYER_NAME_KEY, name);
}

export function storePlayerId(id: string) {
  console.log("Storing", id);
  sessionStorage.setItem(PLAYER_ID_KEY, id);
}

export function storeCardFrequencies(frequencies: Record<string, number>) {
  localStorage.setItem(CARD_FREQUENCIES_KEY, JSON.stringify(frequencies));
}

export function clearCardFrequencies() {
  localStorage.removeItem(CARD_FREQUENCIES_KEY);
}

export function getPlayerName(): string | null {
  return sessionStorage.getItem(PLAYER_NAME_KEY);
}

export function getPlayerId(): string | null {
  return sessionStorage.getItem(PLAYER_ID_KEY);
}

export function getCardFrequencies(): Record<string, number> | null {
  const frequencies = localStorage.getItem(CARD_FREQUENCIES_KEY);
  if (frequencies) {
    return JSON.parse(frequencies);
  }
  return null;
}

export function getPlayerColor(
  game: GameState,
  playerId: string | null,
): PlayerColor | null {
  if (playerId === null) return null;
  if (playerId === game.players.Red.id) return "Red";
  if (playerId === game.players.Blue.id) return "Blue";
  return null;
}
