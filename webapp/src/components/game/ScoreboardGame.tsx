import { FC, useState } from 'react'
import { Player } from './Game';
import './ScoreboardGame.css';

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
        <section>
        <table>
            <caption>Scoreboard</caption>
          <thead>
            <tr>
              <th scope="col" id="rankingHeader">Username</th>
              <th scope="col" id="usernameHeader">Username</th>
              <th scope="col" id="pointsHeader">Points</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((score, index) => {
              return (
                <tr key={index.toString()}>
                  <td headers="rankingHeader">{index+1}</td>
                  <td headers="usernameHeader">{score.username}</td>
                  <td headers="pointsHeader">{score.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    )
}

export default ScoreboardGame;