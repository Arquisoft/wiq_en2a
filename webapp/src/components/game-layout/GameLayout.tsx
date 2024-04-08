import { useState } from "react";
import Game from "../game/singleplayer/GameSinglePlayer";
import {GroupsPage} from "../../pages/groups/index";
import Scoreboard from "../scoreboard/Scoreboard";


const GameLayout = () => {

const [currentView, setCurrentView] = useState("Game");

return(
    <head className="GameHead">
    <nav className="GameNav">
        <ul>
            <li>
                <p>Game</p>
            </li>
            <li>
                <a onClick={()=>setCurrentView("Game")}>Game</a>
            </li>
            <li>
                <a onClick={()=>setCurrentView("Group")} >Groups</a>
            </li>
            <li>
                <a onClick={()=>setCurrentView("Scoreboard")}>Scoreboard</a>
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