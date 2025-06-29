import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  getPlayerId,
  getPlayerName,
  storePlayerId,
  storePlayerName,
} from "../engine/helpers";
import Navigation from "../components/Navigation";
import { COLORS } from "../colors";

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
    <div
      style={{
        maxWidth: "600px",
        margin: "0 auto",
        padding: "0 16px",
        justifyContent: "center",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        fontFamily: "Arial, sans-serif",
        color: COLORS.text,
      }}
    >
      <div style={{ marginBottom: "24px" }}>
        <label
          htmlFor="player-name"
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Display Name
        </label>
        <input
          id="player-name"
          type="text"
          value={name}
          onChange={handleNameChange}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: `1px solid ${COLORS.containerBorder}`,
            backgroundColor: COLORS.container,
            color: COLORS.text,
          }}
        />
      </div>

      <div style={{ marginBottom: "32px" }}>
        <label
          htmlFor="player-id"
          style={{
            display: "block",
            marginBottom: "8px",
            fontWeight: "bold",
            fontSize: "14px",
          }}
        >
          Player ID
        </label>
        <input
          id="player-id"
          type="text"
          value={playerId}
          onChange={handlePlayerIdChange}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: "6px",
            border: `1px solid ${COLORS.containerBorder}`,
            backgroundColor: COLORS.container,
            color: COLORS.text,
            fontFamily: "monospace",
          }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Navigation link="/lobby" displayText="Go to Lobby" arrow="forward" />
        <span style={{}}></span>
      </div>
    </div>
  );
}

export default Home;
