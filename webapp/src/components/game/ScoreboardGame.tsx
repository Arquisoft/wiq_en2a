import { FC } from 'react'
import { Player} from './Game'

interface ScoreboardGameProps {
  players?: Player[];
}

const ScoreboardGame: FC<ScoreboardGameProps> = ({players}) => {
    console.log(players)
  return <div>ScoreboardGame</div>
}

export default ScoreboardGame