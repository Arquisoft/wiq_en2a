import { FC, useState } from 'react'
import { SocketProps, UserPlayer } from './GameMultiPlayer';
import '../LobbyGame.scss';

interface LobbyMultiPlayerProps {
    socket: SocketProps;
    handleCurrentStage: (n: number) => void
    partyCode: string
    users: UserPlayer[]
}

const LobbyMultiPlayer: FC<LobbyMultiPlayerProps> = ({socket, handleCurrentStage, partyCode, users}) => {


  // return <div>
  //   <p>Party code: {partyCode}</p>
  //   {users.map((user, index) => (
  //     <p key={index}>{user}</p>
  //   ))}
  // </div>
  console.log(users)
  return (
    <div className='lobby-container'>
      <h2 className='lobby-title'>Lobby</h2>
      <p>Party code: {partyCode}</p>
      {users.map((player, index) => (
        <div key={player.uuid} className='player-item'>
          <img src={"https://robohash.org/"+player.username+".png"} alt={player.uuid} />
          <p>{player.username}</p>
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
        <button className="start-game-button" onClick={() => handleCurrentStage(3)}></button>
      </div>
    </div>
  )
}

export default LobbyMultiPlayer