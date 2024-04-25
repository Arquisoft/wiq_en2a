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
  const username = localStorage.getItem('username');
  if(userScoresSinglePlayer){
    sorted = userScoresSinglePlayer.sort((a, b) => b.points - a.points);
  } else if (userScoresMultiPlayer){
    sorted = userScoresMultiPlayer.sort((a, b) => b.points - a.points);
  }
    return (
        <table data-testid="scoreboard-table">
            <caption data-testid="scoreboard-caption">Game Scoreboard</caption>
          <thead>
            <tr>
              <th scope="col" id="rankingHeader" data-testid="ranking-header">
                Position</th>
              <th scope="col" id="usernameHeader" data-testid="username-header">
                Username</th>
              <th scope="col" id="pointsHeader" data-testid="points-header">
                Points</th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((score, index) => {
              if(score.username === username) return(
                <tr key={score.username} className='selected'>
                  <td headers="rankingHeader" data-testid={`position-${index}`}>
                    {index+1}</td>
                  <td headers="usernameHeader" data-testid={`username-${index}`}>
                    {score.username}</td>
                  <td headers="pointsHeader" data-testid={`points-${index}`}>
                    {score.points}</td>
                </tr>
              );
              return (
                <tr key={score.username} >
                  <td headers="rankingHeader" data-testid={`position-${index}`}>
                    {index+1}</td>
                  <td headers="usernameHeader" data-testid={`username-${index}`}>
                    {score.username}</td>
                  <td headers="pointsHeader" data-testid={`points-${index}`}>
                    {score.points}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
    )
}

export default ScoreboardGame;