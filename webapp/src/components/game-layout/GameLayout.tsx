import { useState } from "react";
import Game from "../game/singleplayer/GameSinglePlayer";
import { GroupsPage } from "../../pages/groups/index";
import { useTranslation } from 'react-i18next';

const GameLayout = () => {
  const [currentView, setCurrentView] = useState("Game");
  const { t } = useTranslation();

  return(
    <div>
      <header className="GameHead">
        <nav className="GameNav">
          <ul>
              <li>
                  <p data-testid="game-header">{t('game_layout_game')}</p>
              </li>
              <li>
                  <button data-testid="game-link" onClick={()=>setCurrentView("Game")}>{t('game_layout_game')}</button>
              </li>
              <li>
                  <button data-testid="groups-link" onClick={()=>setCurrentView("Group")} >{t('game_layout_group')}</button>
              </li>
            </ul>
        </nav>
      </header>
      <main>
        {currentView === "Game" ? <Game /> : <GroupsPage data-testid="groups-page-component" /> }
      </main>
    </div>
  );
};

export default GameLayout;

