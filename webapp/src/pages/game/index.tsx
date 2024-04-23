import React from "react";
import { Link } from "react-router-dom";
import "./game-page.scss";
import { useTranslation } from 'react-i18next';

export const GamePage: React.FC<{}> = () => {

  const { t } = useTranslation();

  return (
    <div className="game-page-container">
      <button className="game-page-button">
        <Link to="/game/single-player">{t('game_single_player')}</Link>
      </button>
      <button className="game-page-button">
        <Link to="/game/single-player-ai">{t('game_single_player_ai')}</Link>
      </button>
      <button className="game-page-button">
        <Link to="/game/multi-player">{t('game_multiplayer')}</Link>
      </button>
    </div>
  );
};