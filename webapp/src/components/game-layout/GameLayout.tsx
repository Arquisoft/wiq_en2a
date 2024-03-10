import { useState } from "react";
import Game from "../game/Game";
import Group from "../group/Group";
import Scoreboard from "../scoreboard/Scoreboard";
import './GameLayout.scss';

const GameLayout = () => {

const [currentView, setCurrentView] = useState("Game");

return (
    <head className="GameHead">
    <nav className="GameNav">
        <ul>
            <li>
                <p>Game</p>
            </li>
            <li>
                <button onClick={()=>setCurrentView("Game")}>Game</button>
            </li>
            <li>
                <button onClick={()=>setCurrentView("Group")} >Group</button>
            </li>
            <li>
                <button onClick={()=>setCurrentView("Scoreboard")}>Scoreboard</button>
            </li>
        </ul>
    </nav>
    
    import Game from "./Game"; // Import the 'Game' component

    <body>
        {
            currentView === "Game" ? <Game /> :
            currentView === "Group" ? <Group /> :
            <Scoreboard />
        }
    </body>
    </head>
)

}; export default GameLayout; // Export the 'GameLayout' component