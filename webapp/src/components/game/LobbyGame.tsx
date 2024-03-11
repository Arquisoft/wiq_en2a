import { FC } from 'react'
import { Player } from './Game';

interface LobbyGameProps {
  setPlayers: () => void;
  players: Player[]
}

const LobbyGame: FC<LobbyGameProps> = ({}) => {
  return <div>LobbyGame</div>
}

export default LobbyGame