import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Alert from "../components/Alert";
import Navigation from "../components/Navigation";
import { useCardManagement } from "../engine/CardManagementContext";
import {
  getPlayerId,
  getPlayerName,
  storePlayerId,
  storePlayerName,
} from "../utils/identity";
import { CARD_MANAGEMENT_PATH, LOBBY_PATH } from "../utils/navigation";
import { renderActiveExpansions } from "../utils/react";

function Home() {
  const { isModified, activeExpansions } = useCardManagement();

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
    <div className="max-w-2xl mx-auto p-4 flex gap-6 flex-col justify-center min-h-screen text-text">
      <Alert
        displayText={
          isModified
            ? "Using custom card frequencies"
            : "Using default card frequencies"
        }
        secondaryDisplay={renderActiveExpansions(activeExpansions)}
        variant={isModified ? "warning" : "info"}
        visible={true}
      />

      <div className="">
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

      <div className="">
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
        <Navigation
          link={LOBBY_PATH}
          displayText="Go to Lobby"
          arrow="forward"
        />
        <Navigation
          link={CARD_MANAGEMENT_PATH}
          displayText="Card Management"
          arrow="forward"
        />
      </div>
    </div>
  );
}

export default Home;
