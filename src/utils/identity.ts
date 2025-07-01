import { PlayerColor } from "../engine/gameTypes";
import { GameState } from "../engine/gameTypes";

export function storePlayerName(name: string) {
  console.log("Storing", name);
  sessionStorage.setItem("playerName", name);
}

export function storePlayerId(id: string) {
  console.log("Storing", id);
  sessionStorage.setItem("playerId", id);
}

export function getPlayerName(): string | null {
  return sessionStorage.getItem("playerName");
}

export function getPlayerId(): string | null {
  return sessionStorage.getItem("playerId");
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
