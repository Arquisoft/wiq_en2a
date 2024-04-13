import React from "react";
import { Link } from "react-router-dom";
import "./game-page.scss";

export const GamePage: React.FC<{}> = () => {
  return (
    <div className="game-page-container">
      <button className="game-page-button">
        <Link to="/game/single-player">Single Player</Link>
      </button>
      <button className="game-page-button">
        <Link to="/game/single-player-ai">Single Player (AI)</Link>
      </button>
      <button className="game-page-button">
        <Link to="/game/multi-player">Multiplayer</Link>
      </button>
    </div>
  );
};