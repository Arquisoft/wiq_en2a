import { FC } from 'react'
import { SocketProps } from './GameMultiPlayer';
import { Question4Answers } from '../singleplayer/GameSinglePlayer';

interface QuestionsMultiPlayerProps {
    socket: SocketProps;
    handleCurrentStage: (n: number) => void
    questions: Question4Answers[]
}

const QuestionsMultiPlayer: FC<QuestionsMultiPlayerProps> = ({socket,handleCurrentStage,questions}) => {
  return <div>QuestionsMultiPlayer</div>
}

export default QuestionsMultiPlayer