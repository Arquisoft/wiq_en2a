import { FC, useEffect, useState } from 'react'
import { SocketProps } from './GameMultiPlayer';
import '../LobbyGame.css';
import axios from 'axios';

interface LobbyMultiPlayerProps {
    socket: SocketProps;
    handleCurrentStage: (n: number) => void
    partyCode: string
    users: string[]
}

const LobbyMultiPlayer: FC<LobbyMultiPlayerProps> = ({socket, handleCurrentStage, partyCode, users}) => {

  const [fetched, setFetched] = useState(false);

  // return <div>
  //   <p>Party code: {partyCode}</p>
  //   {users.map((user, index) => (
  //     <p key={index}>{user}</p>
  //   ))}
  // </div>
  return (
    <div className='lobby-container'>
      <h2 className='lobby-title'>Lobby</h2>
      <p>Party code: {partyCode}</p>
      {users.map((player, index) => (
        <div key={player} className='player-item'>
          <p>Name: {player}</p>
        </div>
      ))}
      <div className='button-container'>
        {/* {isFetched && <button className="start-game-button" onClick={() => setCurrentStage(2)}>
            Start Game
        </button>}
        {!isFetched && <button className="start-game-button" onClick={() => setCurrentStage(2)} disabled>
            Loading questions...
        </button>} */}
        <button className="start-game-button" onClick={() => handleCurrentStage(3)}></button>
      </div>
    </div>
  )
}

export default LobbyMultiPlayer