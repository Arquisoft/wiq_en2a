import { FC} from 'react'
import { Player } from './singleplayer/GameSinglePlayer';
import './ScoreboardGame.css';
import { PlayerWithPoints } from './multiplayer/GameMultiPlayer';

interface ScoreboardGameProps {
    userScoresSinglePlayer?: Player[];
    userScoresMultiPlayer?: PlayerWithPoints[];
}


const ScoreboardGame:FC<ScoreboardGameProps> = ({userScoresSinglePlayer, userScoresMultiPlayer}) => {
  let sorted;
  if(userScoresSinglePlayer){
    sorted = userScoresSinglePlayer.sort((a, b) => b.points - a.points);
  } else if (userScoresMultiPlayer){
    sorted = userScoresMultiPlayer.sort((a, b) => b.points - a.points);
  }
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