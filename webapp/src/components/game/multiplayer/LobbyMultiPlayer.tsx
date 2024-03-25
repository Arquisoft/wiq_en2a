import { FC } from 'react'
import { SocketProps } from './GameMultiPlayer';

interface LobbyMultiPlayerProps {
    socket: SocketProps;
    handleCurrentStage: (n: number) => void
    partyCode: string
}

const LobbyMultiPlayer: FC<LobbyMultiPlayerProps> = ({socket, handleCurrentStage, partyCode}) => {
  return <div>Party code: {partyCode}</div>
}

export default LobbyMultiPlayer