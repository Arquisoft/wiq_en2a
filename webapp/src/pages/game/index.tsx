import React from "react";
import { Link } from "react-router-dom";
import "./game-page.scss";
import { useTranslation } from 'react-i18next';

export const GamePage: React.FC<{}> = () => {

  const { t } = useTranslation();

  return (
    <div className="game-page-container">
      <Link className="game-page-button" to="/game/single-player">{t('game_single_player')}</Link>
      <Link className="game-page-button" to="/game/multi-player">{t('game_multiplayer')}</Link>
    </div>
  );
};