import { useState } from "react";
import Game from "../game/singleplayer/GameSinglePlayer";
import { GroupsPage } from "../../pages/groups/index";
import Scoreboard from "../scoreboard/Scoreboard";

const GameLayout = () => {
  const [currentView, setCurrentView] = useState("Game");

  return (
    <div>
      <header className="GameHead">
        <nav className="GameNav">
          <ul>
            <li>
              <p data-testid="game-header">Game</p>
            </li>
            <li>
              <a data-testid="game-link" onClick={() => setCurrentView("Game")}>
                Game
              </a>
            </li>
            <li>
              <a data-testid="groups-link" onClick={() => setCurrentView("Group")}>
                Groups
              </a>
            </li>
            <li>
              <a data-testid="scoreboard-link" onClick={() => setCurrentView("Scoreboard")}>
                Scoreboard
              </a>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        {currentView === "Game" ? <Game /> : currentView === "Group" ? <GroupsPage /> : <Scoreboard />}
      </main>
    </div>
  );
};

export default GameLayout;

