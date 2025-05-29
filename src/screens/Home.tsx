import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

function Home() {
  const [name, setName] = useState("Guest");
  const [playerId, setPlayerId] = useState("");

  useEffect(() => {
    const storedName = sessionStorage.getItem("playerName") ?? "Guest";
    const storedId = sessionStorage.getItem("playerId") ?? uuidv4();

    sessionStorage.setItem("playerName", storedName);
    sessionStorage.setItem("playerId", storedId);

    console.log("SESSION STORAGE SET");

    setName(storedName);
    setPlayerId(storedId);
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    sessionStorage.setItem('playerName', e.target.value);
  };

  return (
    <div>
      <p>HOME SCREEN</p>
      <p>PlayerId: {playerId}</p>
      <label>
        Display Name:
        <input value={name} onChange={handleNameChange} />
      </label>
      <div>
        <Link to="/lobby">Go to lobby</Link>
      </div>
    </div>
  );
}


export default Home;