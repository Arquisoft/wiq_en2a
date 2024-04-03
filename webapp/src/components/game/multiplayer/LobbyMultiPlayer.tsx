import { FC } from 'react'
import { SocketProps } from './GameMultiPlayer';

interface LobbyMultiPlayerProps {
    socket: SocketProps;
    handleCurrentStage: (n: number) => void
    partyCode: string
    users: string[]
}

const LobbyMultiPlayer: FC<LobbyMultiPlayerProps> = ({socket, handleCurrentStage, partyCode, users}) => {
  return <div>
    <p>Party code: {partyCode}</p>
    {users.map((user, index) => (
      <p key={index}>{user}</p>
    ))}
  </div>
}

export default LobbyMultiPlayer