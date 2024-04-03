import { FC, useEffect, useState } from 'react'
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

  const fetchQuestions = async () => {
    setFetched(false)
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    try {
      console.log(users)
      const requestData = {
        players: users.map((user) => ({uuid: user.uuid}))
      }
      console.log("requestData")
      console.log(requestData)
      const response = await axios.post(`${apiEndpoint}/createGame`, requestData);
  
      console.log("Juego creado")
      console.log(response.data)
      socket.emit('updateQuestions', partyCode, response.data);
      setFetched(true);
    } catch (error) {
      console.error('Error al obtener las preguntas:', error);
    }
  };

  return (
    <div className='lobby-container'>
      <h2 className='lobby-title'>Lobby - Multiplayer</h2>
      <p>Party code: {partyCode}</p>
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
        {/* {isFetched && <button className="start-game-button" onClick={() => setCurrentStage(2)}>
            Start Game
        </button>}
        {!isFetched && <button className="start-game-button" onClick={() => setCurrentStage(2)} disabled>
            Loading questions...
        </button>} */}
        <button className="start-game-button" onClick={() => handleCurrentStage(3)}>Exit</button>
        {isFetched && <button className="start-game-button" onClick={fetchQuestions}>Start game</button>}
        {!isFetched && <button className="start-game-button"  disabled>Loading questions ...</button>}
      </div>
    </div>
  )
}

export default LobbyMultiPlayer