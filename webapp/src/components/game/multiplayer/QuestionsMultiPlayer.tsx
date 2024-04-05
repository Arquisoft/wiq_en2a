import { FC, useState } from 'react'
import { SocketProps } from './GameMultiPlayer';
import { Question4Answers } from '../singleplayer/GameSinglePlayer';
import axios from 'axios';
import '../QuestionsGame.scss';

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

    const predefinedColors = ['#ff6666', '#66ccff', '#99ff99', '#ffcc66', '#cc99ff'];
    const [currentColorIndex, setCurrentColorIndex] = useState(0);


    const handleAnswerClick = async (answer: string) => {
      if(questions[currentQuestion].correctAnswer === answer){
        setCorrectAnswers(correctAnswers + 1);
        setCurrentColorIndex((currentColorIndex + 1) % predefinedColors.length);
      }

      setCurrentQuestion(currentQuestion + 1);
      if(currentQuestion+2 === questions.length){
        const totalPoints = calculatePoints(correctAnswers, questions.length);
        // the player has finished the game
        // update stats for each player
        const requestData ={ "players": [{
          "uuid": uuid,
          "nCorrectAnswers": correctAnswers,
          "nWrongAnswers": questions.length - correctAnswers,
          "totalScore": totalPoints,
          "isWinner": false
        }]}

        // update score in localstorage
        const previousScore = parseInt(localStorage.getItem("score"))
        localStorage.setItem("score", (previousScore + totalPoints).toString())

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
          <div className="question-container">
            <h2 className="question-title">Question {currentQuestion + 1}</h2>
            <h4>{questions[currentQuestion].question}</h4>
            </div>
            <div className="answer-grid">
              {getShuffledAnswers().map((answer) => (
                <button key={answer} onClick={() => handleAnswerClick(answer)} 
                style={{ backgroundColor: predefinedColors[(currentQuestion+1 + currentColorIndex) % predefinedColors.length] }}>
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