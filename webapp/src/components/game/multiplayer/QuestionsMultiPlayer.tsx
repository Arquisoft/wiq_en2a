import { FC, useState } from 'react'
import { SocketProps } from './GameMultiPlayer';
import { Question4Answers } from '../singleplayer/GameSinglePlayer';
import axios from 'axios';

interface QuestionsMultiPlayerProps {
    socket: SocketProps;
    handleCurrentStage: (n: number) => void
    questions: Question4Answers[]
    partyCode: string
}

const QuestionsMultiPlayer: FC<QuestionsMultiPlayerProps> = ({socket, questions, partyCode}) => {
    const uuid = localStorage.getItem("userUUID");
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    const handleAnswerClick = async (answer: string) => {
      if(questions[currentQuestion].correctAnswer === answer){
        setCorrectAnswers(correctAnswers + 1);
        
      }
      setCurrentQuestion(currentQuestion + 1);
      console.log(currentQuestion+2)
      console.log(questions.length)
      if(currentQuestion+2 === questions.length){
        const totalPoints = calculatePoints(correctAnswers, questions.length);
        // the player has finished the game
        console.log("finish")
        // update stats for each player
        const requestData ={ "players": [{
          "uuid": uuid,
          "nCorrectAnswers": correctAnswers,
          "nWrongAnswers": questions.length - correctAnswers,
          "totalScore": totalPoints,
          "isWinner": false
        }]}
        await axios.post(`${apiEndpoint}/updateStats`, requestData);
        // pass the points obtained of each player to the socket
        socket.emit('playerFinished', partyCode, totalPoints)
      }
    };

    const calculatePoints = (correctAnswers: number, totalQuestions: number) => {
      const incorrectQuestions = totalQuestions - correctAnswers;
      const points = correctAnswers * 100 - incorrectQuestions * 25;
      return points;
    }

    const getShuffledAnswers = () => {
      const answers = [
        questions[currentQuestion].correctAnswer,
        questions[currentQuestion].incorrectAnswer1,
        questions[currentQuestion].incorrectAnswer2,
        questions[currentQuestion].incorrectAnswer3,
      ];
  
      for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
      }
  
      return answers;
    };

    return (
      <div>
      {(currentQuestion+1) < questions.length && (
        <>
          <h2>Question {currentQuestion + 1}</h2>
          <p>{questions[currentQuestion].question}</p>
          <div className="answer-grid">
            {getShuffledAnswers().map((answer) => (
              <button
                key={answer}
                onClick={() => handleAnswerClick(answer)}
              >
                {answer}
              </button>
            ))}
          </div>
        </>
      )}
      {currentQuestion+1 === questions.length && ( 
        <>
          <p>You answered {correctAnswers} out of {questions.length} questions correctly.</p>
          <p>You earned {calculatePoints(correctAnswers, questions.length)} points.</p>
          <p>Waiting for the rest of the players to finish...</p>
        </>
      )}
    </div>
    )
}

export default QuestionsMultiPlayer