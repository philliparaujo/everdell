import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  getPlayerId,
  getPlayerName,
  storePlayerId,
  storePlayerName,
} from "../engine/helpers";
import Navigation from "../components/Navigation";

function Home() {
  const [name, setName] = useState(() => {
    const storedName = getPlayerName();
    if (storedName) {
      return storedName;
    }
    const defaultName = "Guest";
    storePlayerName(defaultName);
    return defaultName;
  });

  const [playerId, setPlayerId] = useState(() => {
    const storedId = getPlayerId();
    if (storedId) {
      return storedId;
    }
    const newId = uuidv4();
    storePlayerId(newId);
    return newId;
  });

  useEffect(() => {
    storePlayerName(name);
    storePlayerId(playerId);
  }, [name, playerId]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handlePlayerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerId(e.target.value);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 flex flex-col justify-center min-h-screen text-text">
      <div className="mb-6">
        <label htmlFor="player-name" className="block mb-2 font-bold text-sm">
          Display Name
        </label>
        <input
          id="player-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          className="w-full px-3 py-2.5 rounded-md border font-sans border-container-border bg-container text-text"
        />
      </div>

      <div className="mb-8">
        <label htmlFor="player-id" className="block mb-2 font-bold text-sm">
          Player ID
        </label>
        <input
          id="player-id"
          type="text"
          value={playerId}
          onChange={handlePlayerIdChange}
          className="w-full px-3 py-2.5 rounded-md border font-mono border-container-border bg-container text-text"
        />
      </div>

      <div className="flex justify-between">
        <Navigation link="/lobby" displayText="Go to Lobby" arrow="forward" />
        <span></span>
      </div>
    </div>
  );
}

export default Home;
