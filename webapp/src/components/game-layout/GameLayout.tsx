import { useState } from "react";
import Game from "../game/singleplayer/GameSinglePlayer";
import {GroupsPage} from "../../pages/groups/index";
import Scoreboard from "../scoreboard/Scoreboard";
import { useTranslation } from 'react-i18next';


const GameLayout = () => {

const [currentView, setCurrentView] = useState("Game");
const { t } = useTranslation();

return(
    <head className="GameHead">
    <nav className="GameNav">
        <ul>
            <li>
                <p>{t('game_layout_game')}</p>
            </li>
            <li>
                <button onClick={()=>setCurrentView("Game")}>{t('game_layout_game')}</button>
            </li>
            <li>
                <button onClick={()=>setCurrentView("Group")} >{t('game_layout_group')}</button>
            </li>
            <li>
                <button onClick={()=>setCurrentView("Scoreboard")}>{t('game_layout_scoreboard')}</button>
            </li>
        </ul>
    </nav>
    
    import Game from "./Game"; // Import the 'Game' component

    <body>
        {currentView === "Game" ? <Game /> :
            currentView === "Group" ? <GroupsPage /> :
                <Scoreboard />}
    </body>
    </head>

)

}; export default GameLayout; // Export the 'GameLayout' component