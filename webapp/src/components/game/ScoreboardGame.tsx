import { FC} from 'react'
import { Player } from './GameSinglePlayer';
import './ScoreboardGame.css';

interface ScoreboardGameProps {
    userScores: Player[];
}


const ScoreboardGame:FC<ScoreboardGameProps> = ({userScores}) => {
    const sorted = userScores.sort((a, b) => b.points - a.points);
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
                <tr key={score.username}>
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