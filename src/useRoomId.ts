import { useParams } from "react-router-dom";

export function useRoomId(): string {
  const { gameId } = useParams<{ gameId: string }>();
  if (!gameId) {
    throw new Error("Missing gameId in URL");
  }
  return gameId;
}
