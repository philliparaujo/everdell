import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { getPlayerId, getPlayerName, storePlayerId, storePlayerName } from '../engine/helpers';

function Home() {
  const [name, setName] = useState("Guest");
  const [playerId, setPlayerId] = useState("");

  useEffect(() => {
    const storedName = getPlayerName() ?? "Guest";
    const storedId = getPlayerId() ?? uuidv4();

    storePlayerName(storedName);
    storePlayerId(storedId);

    console.log("SESSION STORAGE SET");

    setName(storedName);
    setPlayerId(storedId);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    storePlayerName(e.target.value);
  };

  const handlePlayerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerId(e.target.value);
    storePlayerId(e.target.value);
  }

  return (
    <div>
      <p>HOME SCREEN</p>
      <div>
        <label>
          PlayerId:
          <input value={playerId} onChange={handlePlayerIdChange} style={{ width: '300px' }} />
        </label>
      </div>
      <div>
        <label>
          Display Name:
          <input value={name} onChange={handleNameChange} />
        </label>
      </div>
      <div>
        <Link to="/lobby">Go to lobby</Link>
      </div>
    </div>
  );
}


export default Home;