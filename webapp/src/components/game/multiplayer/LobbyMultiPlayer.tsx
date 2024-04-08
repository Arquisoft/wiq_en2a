import { FC, useState } from 'react'
import { SocketProps, UserPlayer } from './GameMultiPlayer';
import '../LobbyGame.scss';
import axios from 'axios';

interface LobbyMultiPlayerProps {
    socket: SocketProps;
    handleCurrentStage: (n: number) => void
    partyCode: string
    users: UserPlayer[]
}

const LobbyMultiPlayer: FC<LobbyMultiPlayerProps> = ({socket, handleCurrentStage, partyCode, users}) => {

  const [isFetched, setFetched] = useState<boolean>(true);

  const uuid = localStorage.getItem("uuid");

  const fetchQuestions = async () => {
    setFetched(false)
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    try {
      const requestData = {
        players: users.map((user) => ({uuid: user.uuid}))
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
        <h2 className='lobby-title'>Lobby - Multiplayer</h2>
        <p>Party code: <b>{partyCode}</b></p>
      </div>
      {users.map((player) => (
        <div key={player.uuid} className='player-item'>
          <img src={"https://robohash.org/"+player.username+".png"} alt={player.uuid} />
          <p>{player.username}</p>
          {player.isAdmin && <p>Admin</p>}
          {!player.isAdmin && <p>Player</p>}
          <p>Points: {player.totalPoints}</p>
        </div>
      ))}
      <div className='button-container'>
        <button className="exit-lobby-button" onClick={exitLobby}>Exit</button>
        {isFetched && isAdmin() && <button className="start-game-button" onClick={fetchQuestions}>Start game</button>}
        {isFetched && !isAdmin() && <button className="start-game-button" onClick={fetchQuestions} disabled>Start game</button>}
        {!isFetched && <button className="start-game-button"  disabled>Loading questions ...</button>}
      </div>
    </div>
  )
}

export default LobbyMultiPlayer