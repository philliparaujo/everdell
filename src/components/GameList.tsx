import { GameState, Player, PlayerColor } from "../engine/gameTypes";
import { renderActiveExpansions } from "../utils/react";
import Button from "./Button";
import Id from "./Id";

const GamePlayerDisplay = ({
  player,
  isYou,
}: {
  player: Player;
  isYou: boolean;
}) => {
  const color = player.color;
  const displayName = !player.id
    ? color
    : `${isYou ? "(Me) " : ""}${player.name}`;
  const displayId = !player.id ? "Open Slot" : player.id;

  const playerColorClass: Record<PlayerColor, string> = {
    Red: "text-player-red",
    Blue: "text-player-blue",
  };

  return (
    <div>
      <div className={`font-bold ${playerColorClass[color]}`}>
        {displayName}
      </div>
      <Id id={displayId} />
    </div>
  );
};

function GameList({
  list,
  playerId,
  onJoinGame,
  onRejoinGame,
  onSpectateGame,
  onDeleteGame,
}: {
  list: { id: string; game: GameState }[];
  playerId: string | null;
  onJoinGame: (id: string, color: PlayerColor) => void;
  onRejoinGame: (id: string) => void;
  onSpectateGame: (id: string) => void;
  onDeleteGame: (id: string) => void;
}) {
  const isDisabled = !playerId;

  return (
    <ul className="list-none p-0 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4 overflow-y-auto pr-2 ">
      {list.map(({ id, game }) => {
        const redPlayer = game.players.Red;
        const bluePlayer = game.players.Blue;

        const isPlayerInGame =
          playerId && [redPlayer.id, bluePlayer.id].includes(playerId);
        const canJoinRed = !redPlayer.id;
        const canJoinBlue = !bluePlayer.id;

        return (
          <li
            key={id}
            className="border-container-border bg-container rounded-lg p-4 flex flex-col gap-2"
          >
            <div className="flex items-baseline gap-1">
              <strong>Game ID:</strong>
              <Id id={id} />
            </div>

            {renderActiveExpansions(game.activeExpansions)}

            <div className="flex justify-between min-h-[40px] mt-2">
              <GamePlayerDisplay
                player={redPlayer}
                isYou={playerId === redPlayer.id}
              />
              <GamePlayerDisplay
                player={bluePlayer}
                isYou={playerId === bluePlayer.id}
              />
            </div>

            <div className="flex justify-between items-end gap-3 mt-auto pt-3 border-t border-container-border">
              <div className="flex gap-2 flex-wrap">
                {canJoinRed && !isPlayerInGame && (
                  <Button
                    onClick={() => onJoinGame(id, "Red")}
                    disabled={isDisabled}
                    variant="important"
                  >
                    Join as Red
                  </Button>
                )}
                {canJoinBlue && !isPlayerInGame && (
                  <Button
                    onClick={() => onJoinGame(id, "Blue")}
                    disabled={isDisabled}
                    variant="important"
                  >
                    Join as Blue
                  </Button>
                )}
                {isPlayerInGame && (
                  <Button onClick={() => onRejoinGame(id)} variant="important">
                    Rejoin
                  </Button>
                )}
                {!isPlayerInGame && (
                  <Button onClick={() => onSpectateGame(id)}>Spectate</Button>
                )}
                <Button
                  onClick={() => onDeleteGame(id)}
                  disabled={isDisabled}
                  variant="danger"
                >
                  Delete
                </Button>
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default GameList;
