import { FC} from 'react'
import { Player } from './singleplayer/GameSinglePlayer';
import './scoreboard-game.scss';
import { PlayerWithPoints } from './multiplayer/GameMultiPlayer';

interface ScoreboardGameProps {
    userScoresSinglePlayer?: Player[];
    userScoresMultiPlayer?: PlayerWithPoints[];
}


const ScoreboardGame:FC<ScoreboardGameProps> = ({userScoresSinglePlayer, userScoresMultiPlayer}) => {
  let sorted;
  const username = localStorage.getItem('username');
  if(userScoresSinglePlayer){
    sorted = userScoresSinglePlayer.sort((a, b) => b.points - a.points);
  } else if (userScoresMultiPlayer){
    sorted = userScoresMultiPlayer.sort((a, b) => b.points - a.points);
  }
    return (
        <table>
            <caption>Game Scoreboard</caption>
          <thead>
            <tr>
              <th scope="col" id="rankingHeader">Position</th>
              <th scope="col" id="usernameHeader">Username</th>
              <th scope="col" id="pointsHeader">Points</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((score, index) => {
              if(score.username === username) return(
                <tr key={score.username} className='selected'>
                  <td headers="rankingHeader">{index+1}</td>
                  <td headers="usernameHeader">{score.username}</td>
                  <td headers="pointsHeader">{score.points}</td>
                </tr>
              );
              return (
                <tr key={score.username} >
                  <td headers="rankingHeader">{index+1}</td>
                  <td headers="usernameHeader">{score.username}</td>
                  <td headers="pointsHeader">{score.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
    )
}

export default ScoreboardGame;