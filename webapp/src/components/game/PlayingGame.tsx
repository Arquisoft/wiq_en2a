import { FC } from 'react'
import { Question4Answers } from './Game'

interface PlayingGameProps {
  questions: Question4Answers[]
}

const PlayingGame: FC<PlayingGameProps> = ({questions}) => {
    console.log(questions)
  return <div>PlayingGame</div>
}

export default PlayingGame