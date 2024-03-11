


import { useState } from 'react';
import { Score } from './Game';

const [sorted, setSorted] = useState<Score[]>([]);

const Scoreboard = (userScores: Score[]) => {

    //Get the scores and sort them
   setSorted( userScores.sort((a, b) => { 
        return parseInt(b.points) - parseInt(a.points);
    }));

    //Return the scoreboard
    return (
        <div>
            <h1>Scoreboard</h1>
            <p>Here is the scoreboard</p>
            <ul>
                {sorted.map((score, index) => {
                    return <li key={index}>{score.username}: {score.points}</li>
                })} 
            </ul>
        </div>
    )
}

export default Scoreboard;