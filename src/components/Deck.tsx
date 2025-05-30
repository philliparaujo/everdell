import { useGame } from "../engine/GameContext";
import CardPreview from "./CardPreview";

function Deck() {
  const { game } = useGame();

  const deck = game.deck;
  const numCards = Math.ceil(deck.length / 40);

  return (<>
    {Array.from({ length: numCards }).map((_, index) => {
      return (<CardPreview card={null} index={index} key={index} placedDown={false} cityColor={null} />)
    })}
  </>
  )
}

export default Deck;