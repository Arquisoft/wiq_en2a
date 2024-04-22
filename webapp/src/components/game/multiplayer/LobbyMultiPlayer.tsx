import { FC, useState } from 'react'
import { SocketProps, UserPlayer } from './GameMultiPlayer';
import '../lobby-game.scss';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

interface LobbyMultiPlayerProps {
  socket: SocketProps;
  handleCurrentStage: (n: number) => void
  partyCode: string
  users: UserPlayer[]
}

const LobbyMultiPlayer: FC<LobbyMultiPlayerProps> = ({ socket, handleCurrentStage, partyCode, users }) => {

  const [isFetched, setFetched] = useState<boolean>(true);

  const uuid = localStorage.getItem("uuid");

  const { t } = useTranslation();

  const fetchQuestions = async () => {
    setFetched(false)
    const apiEndpoint = 'http://localhost:8000'
    //const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    try {
      const requestData = {
        players: users.map((user) => ({ uuid: user.uuid }))
      }
      const response = await axios.post(`${apiEndpoint}/createGame`, requestData);

      socket.emit('updateQuestions', partyCode, response.data);
      setFetched(true);
    } catch (error) {
      console.error('Error al obtener las preguntas:', error);
    }
  };

  const exitLobby = () => {
    socket.emit('exitParty', partyCode)
    handleCurrentStage(1)
  }

  const isAdmin = () => {
    return users.some((user) => user.uuid === uuid && user.isAdmin);
  }

  return (
    <div className='lobby-container'>
      <div className='lobby-title-container'>
        <h2 className='lobby-title'>{t('lobby_multiplayer_title')}</h2>
        <p>{t('lobby_multiplayer_party_code')}<b>{partyCode}</b></p>
      </div>
      {users.map((player) => (
        <div key={player.uuid} className='player-item'>
          <img src={"https://robohash.org/" + player.username + ".png"} alt={player.uuid} />
          <p>{player.username}</p>
          {player.isAdmin && <p>{t('lobby_multiplayer_admin')}</p>}
          {!player.isAdmin && <p>{t('lobby_multiplayer_player')}</p>}
          <p>{t('lobby_multiplayer_points')}{player.totalPoints}</p>
        </div>
      ))}
      <div className='button-container'>
        <button className="exit-lobby-button" onClick={exitLobby}>{t('lobby_multiplayer_exit')}</button>
        {isFetched && isAdmin() && <button className="start-game-button" onClick={fetchQuestions}>{t('lobby_multiplayer_start_game')}</button>}
        {isFetched && !isAdmin() && <button className="start-game-button" onClick={fetchQuestions} disabled>{t('lobby_multiplayer_start_game')}</button>}
        {!isFetched && <button className="start-game-button" disabled>{t('lobby_multiplayer_loading_questions')}</button>}
      </div>
    </div>
  )
}

export default LobbyMultiPlayer