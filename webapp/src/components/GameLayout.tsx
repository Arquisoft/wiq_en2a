import { useState } from "react";
import Game from "./game/Game";
import Group from "./Group";
import Scoreboard from "./ScoreBoard";


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
                <a onClick={()=>setCurrentView("Group")} >Group</a>
            </li>
            <li>
                <a onClick={()=>setCurrentView("Scoreboard")}>Scoreboard</a>
            </li>
        </ul>
    </nav>
    
    import Game from "./Game"; // Import the 'Game' component

    <body>
        {currentView === "Game" ? <Game /> :
            currentView === "Group" ? <Group /> :
                <Scoreboard />}
    </body>
    </head>

)



}; export default GameLayout; // Export the 'GameLayout' component