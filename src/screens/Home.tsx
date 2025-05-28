import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function Home() {
  useEffect(() => {
    let playerId = localStorage.getItem('playerId');
    if (!playerId) {
      playerId = uuidv4();
      console.log(playerId);
      localStorage.setItem('playerId', playerId);
    }
  }, []);

  return (
    <div>
      <p>HOME SCREEN</p>
      <p>{localStorage.getItem('playerId')}</p>
      <Link to="/lobby">{"Go to lobby"}</Link>
    </div>
  );
}

export default Home;