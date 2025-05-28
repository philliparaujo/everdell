import { useParams } from "react-router-dom";
import whitecoin from "../assets/icons/whitecoin.png";
import CardPreview from '../components/CardPreview';
import EventsDisplay from '../components/EventsDisplay';
import { CustomResourceIcon } from "../components/Icons";
import LocationsDisplay from '../components/LocationsDisplay';
import PlayerStatuses from '../components/PlayerStatus';
import { useGame } from '../engine/GameContext';

const scrollRowStyle: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'nowrap',
  overflowX: 'auto',
  overflowY: 'hidden',
  gap: '8px',
  padding: '4px',
  border: '1px solid #ddd',
  borderRadius: '4px',
  height: '100%',
};

function Game() {
  const {
    game,
    toggleCardDiscarding,
    toggleCardPlaying,
  } = useGame();
  const { gameId } = useParams();

  const currentPlayer = game.players[game.turn];

  const oppositePlayerColor = game.turn === "Red" ? "Blue" : "Red";
  const oppositePlayer = game.players[oppositePlayerColor];

  const isDiscarding = currentPlayer.discarding;
  const isPlaying = currentPlayer.playing;

  return (
    <div style={{ padding: '16px', fontFamily: 'sans-serif' }}>
      <div>Game ID: {gameId}</div>
      <LocationsDisplay />
      <EventsDisplay />
      <PlayerStatuses />

      {/* Hand */}
      <section>
        <h4>Hand</h4>
        <div style={scrollRowStyle}>
          {Array.from({ length: 8 }).map((_, index) => {
            const card = currentPlayer.hand[index] ?? null;

            return (
              <CardPreview
                key={index}
                index={index}
                card={card}
                placedDown={false}
                cityColor={null}
                onClick={() => {
                  if (isDiscarding && card) {
                    toggleCardDiscarding(game.turn, "hand", index);
                  } else if (isPlaying && card) {
                    toggleCardPlaying(game.turn, "hand", index);
                  }
                }}
              />
            )
          })}
        </div>
      </section>

      {/* Meadow */}
      <section>
        <h4>Meadow</h4>
        <div style={scrollRowStyle}>
          {Array.from({ length: 8 }).map((_, index) => {
            const card = game.meadow[index] ?? null;

            return (
              <CardPreview
                key={index}
                index={index}
                card={card}
                placedDown={false}
                cityColor={null}
                onClick={() => {
                  if (isDiscarding && card) {
                    toggleCardDiscarding(game.turn, "meadow", index);
                  } else if (isPlaying && card) {
                    toggleCardPlaying(game.turn, "meadow", index);
                  }
                }}
              />
            )
          })}
        </div>
      </section>

      {/* My City */}
      <section>
        <h4>
          My City (
          <CustomResourceIcon path={whitecoin} /> {currentPlayer.city.reduce((acc, curr) => acc + curr.value, 0)}
          )
        </h4>
        <div style={scrollRowStyle}>
          {Array.from({ length: 15 }).map((_, index) => {
            const card = currentPlayer.city[index] ?? null;

            return (
              <CardPreview
                key={index}
                index={index}
                card={card}
                placedDown={true}
                cityColor={game.turn}
                onClick={() => {
                  if (isDiscarding && card) {
                    toggleCardDiscarding(game.turn, "city", index);
                  }
                }}
              />
            )
          })}
        </div>
      </section>

      {/* Opposite City */}
      <section>
        <h4>
          Opposite City (
          <CustomResourceIcon path={whitecoin} /> {oppositePlayer.city.reduce((acc, curr) => acc + curr.value, 0)}
          )
        </h4>
        <div style={scrollRowStyle}>
          {Array.from({ length: 15 }).map((_, index) => {
            const card = oppositePlayer.city[index] ?? null;

            return (
              <CardPreview
                key={index}
                index={index}
                card={card}
                placedDown={true}
                cityColor={oppositePlayerColor}
                onClick={() => {
                  if (isDiscarding && card) {
                    toggleCardDiscarding(game.turn, "city", index);
                  }
                }}
              />
            )
          })}
        </div>
      </section>

      {/* Discard Pile */}
      <section>
        <h4>Discard Pile</h4>
        <div style={scrollRowStyle}>
          {game.discard.map((card, index) => {
            return (
              <CardPreview
                key={index}
                index={index}
                card={card}
                placedDown={false}
                cityColor={null}
                onClick={() => {
                  if (isPlaying && card) {
                    toggleCardPlaying(game.turn, "discard", index);
                  }
                }}
              />
            )
          })}
        </div>
      </section>
    </div>
  );
}

export default Game;
