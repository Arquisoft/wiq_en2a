import { FC, useState } from 'react'
import { Player } from './Game';

interface ScoreboardGameProps {

    userScores: Player[];
}


const ScoreboardGame:FC<ScoreboardGameProps> = (props: ScoreboardGameProps) => {

    const [sorted, setSorted] = useState<Player[]>([]);

    //Get the scores and sort them
   setSorted( props.userScores.sort((a, b) => { 
        return b.points - a.points;
    }));

    //Return the scoreboard
    return (
        <div>
            <h1>Scoreboard</h1>
            <p>Here is the scoreboard</p>
            <ul>
                {sorted.map((score, index) => {
                    return <li key={index.toString()}>{score.username}: {score.points}</li>
                })} 
            </ul>
        </div>
    )
}

export default ScoreboardGame;