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

  console.log(users)
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
        <button className="start-game-button" onClick={() => handleCurrentStage(3)}>Start game</button>
      </div>
    </div>
  )
}

export default LobbyMultiPlayer