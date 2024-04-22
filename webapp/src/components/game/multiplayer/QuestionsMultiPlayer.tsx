import { FC, useCallback, useEffect, useMemo, useState } from 'react'
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

    const answersShuffled = useMemo(() => {
      return questions.map((question) => {
        const answers = [question.correctAnswer, question.incorrectAnswer1, question.incorrectAnswer2, question.incorrectAnswer3];
        for (let i = answers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [answers[i], answers[j]] = [answers[j], answers[i]];
        }
        return answers;
      });
    }, [questions]);

    const uuid = localStorage.getItem("userUUID");
    const apiEndpoint = 'http://conoceryvencer.xyz:8000'
    //const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [seconds, setSeconds] = useState(10);

    const [isWaiting, setIsWaiting] = useState<boolean>(false);

    const endGame = useCallback(async () => {
      const totalPoints = calculatePoints(correctAnswers, questions.length);
      const requestData = {
        "players": [{
          "uuid": uuid,
          "nCorrectAnswers": correctAnswers,
          "nWrongAnswers": questions.length - correctAnswers,
          "totalScore": totalPoints,
          "isWinner": false
        }]
      };
    
      const previousScore = parseInt(localStorage.getItem("score"));
      localStorage.setItem("score", (previousScore + totalPoints).toString());
    
      await axios.post(`${apiEndpoint}/updateStats`, requestData);
      socket.emit('playerFinished', partyCode, totalPoints);

    }, [correctAnswers, questions.length, uuid, apiEndpoint, socket, partyCode]);

    useEffect(() => {
      const intervalId = setInterval(async () => {
        if((currentQuestion+1) < questions.length){
          if (seconds > 0) {
            setSeconds(prevSeconds => prevSeconds - 1);
          } else {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
            clearInterval(intervalId);
            setSeconds(10);
            if(currentQuestion+2 === questions.length){
              await endGame()
            }
          }
        }
      }, 1000);
      
      return () => clearInterval(intervalId);
    }, [seconds, currentQuestion, questions, endGame]);


    const handleAnswerClick = async (answer: string, isCorrect:boolean) => {
      setSeconds(10);
      if(!isWaiting){
        setIsWaiting(true);
        setSelectedAnswer(answer);
        
          setTimeout(() => {
            if (isCorrect) {
              setCorrectAnswers(correctAnswers + 1);
            }
            setCurrentQuestion(currentQuestion + 1);
            setSelectedAnswer(null);
          }, 1000);
        setIsWaiting(false);
      }
      
      if(currentQuestion+2 === questions.length){
        await endGame();
      }
    };

    const calculatePoints = (correctAnswers: number, totalQuestions: number) => {
      const incorrectQuestions = totalQuestions - correctAnswers;
      const points = correctAnswers * 100 - incorrectQuestions * 25;
      return points;
    }

    const getAnswers = () => {
      const answers = answersShuffled[currentQuestion];
      if (answers.length > 4) {
        console.log(answers)
        const removeCount = answers.length - 4;
        answers.splice(0, removeCount);
      }
      return answersShuffled[currentQuestion];
    };

    return (
      <div>
      {(currentQuestion+1) < questions.length && (
        <>
          <div className="question-container">
            <h2 className="question-title">Question {currentQuestion + 1} / {questions.length}</h2>
            <h4>{questions[currentQuestion].question}</h4>
            <h4>{seconds}</h4>
          </div>
          <div className="answer-grid">
            {getAnswers().map((answer) => {
                const isCorrect = questions[currentQuestion].correctAnswer === answer;
                const buttonColor = (selectedAnswer === answer && !isWaiting) ? (isCorrect ? '#66ff66' : '#ff6666') : '#89c3ff';
              return (
              <button key={answer} onClick={() => handleAnswerClick(answer, isCorrect)} 
                style={{ backgroundColor: buttonColor }}>
                {answer}
              </button>
            )}
            )}
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