import { FC} from 'react'
import { Player } from './singleplayer/GameSinglePlayer';
import './scoreboard-game.scss';
import { PlayerWithPoints } from './multiplayer/GameMultiPlayer';
import { useTranslation } from 'react-i18next';

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
  const { t } = useTranslation();
    return (
        <table>
            <caption>{t('scoreboard_game_game_scoreboard')}</caption>
          <thead>
            <tr>
              <th scope="col" id="rankingHeader">{t('scoreboard_game_position')}</th>
              <th scope="col" id="usernameHeader">{t('scoreboard_game_username')}</th>
              <th scope="col" id="pointsHeader">{t('scoreboard_game_points')}</th>
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