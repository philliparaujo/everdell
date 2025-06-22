import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  getPlayerId,
  getPlayerName,
  storePlayerId,
  storePlayerName,
} from "../engine/helpers";
import Navigation from "../components/Navigation";
import BackgroundContainer from "../components/BackgroundContainer";

function Home() {
  // Use lazy initializers for name and playerId
  // The function passed to useState will only run once on initial render
  const [name, setName] = useState(() => {
    const storedName = getPlayerName();
    if (storedName) {
      return storedName;
    }
    // If no stored name, set a default and store it immediately
    const defaultName = "Guest";
    storePlayerName(defaultName);
    return defaultName;
  });

  const [playerId, setPlayerId] = useState(() => {
    const storedId = getPlayerId();
    if (storedId) {
      return storedId;
    }
    // If no stored ID, generate a new one and store it immediately
    const newId = uuidv4();
    storePlayerId(newId);
    return newId;
  });

  // This useEffect is now primarily for logging or other effects
  // that depend on the final state values after initial setup.
  // It will run after the initial render (where state is initialized)
  // and again whenever `name` or `playerId` changes.
  useEffect(() => {
    console.log("Home component rendered/state updated.");
    console.log("Current Player Name (from state):", name);
    console.log("Current Player ID (from state):", playerId);

    // If you specifically want to log what's *in* session storage
    // after the component has rendered, you can get it directly:
    console.log(
      "Player Name (from sessionStorage):",
      sessionStorage.getItem("playerName"),
    );
    console.log(
      "Player ID (from sessionStorage):",
      sessionStorage.getItem("playerId"),
    );
  }, [name, playerId]); // Re-run effect if name or playerId changes

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
    storePlayerName(e.target.value); // Persist change to session storage immediately
  };

  const handlePlayerIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPlayerId(e.target.value);
    storePlayerId(e.target.value); // Persist change to session storage immediately
  };

  return (
    <BackgroundContainer>
      <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
        <h2>Home Screen</h2> {/* Changed to h2 for better semantic structure */}
        <p>Welcome, {name}!</p> {/* Display current name */}
        <div style={{ marginBottom: "15px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Player ID:
          </label>
          <input
            type="text"
            value={playerId}
            onChange={handlePlayerIdChange}
            style={{
              width: "300px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label
            style={{
              display: "block",
              marginBottom: "5px",
              fontWeight: "bold",
            }}
          >
            Display Name:
          </label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            style={{
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <Navigation link="/lobby" displayText="Go to Lobby" arrow="forward" />
      </div>
    </BackgroundContainer>
  );
}

export default Home;
