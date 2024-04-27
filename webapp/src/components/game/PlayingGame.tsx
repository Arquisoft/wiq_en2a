import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { Player, Question4Answers } from './singleplayer/GameSinglePlayer'
import axios from 'axios';
import shuffleAnswers from './util/SuffleAnswers';
import calculatePoints from './util/CalculatePoints';  
import { SocketProps } from './multiplayer/GameMultiPlayer';
import "./QuestionsGame.scss"

interface PlayingGameProps {
  questions: Question4Answers[]
  setCurrentStage: (n: number) => void;

  setPlayers?: (players:Player[]) => void;
  players?: Player[];
  socket?: SocketProps;
  partyCode?: string;
}

const PlayingGame: FC<PlayingGameProps> = ({questions, setCurrentStage, setPlayers, players, socket, partyCode}) => {
    
    const uuid = localStorage.getItem("userUUID");
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [seconds, setSeconds] = useState(10);

    const [isWaiting, setIsWaiting] = useState<boolean>(false);

    const answersShuffled = useMemo(() => shuffleAnswers(questions), [questions]);

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
      if(players){
        players.map(player => {
          const randomPoints = Math.floor(Math.random() * (1000 - 100 + 1) / 50) * 50 + 100;
          if(player.isBot){
            player.points += randomPoints;
          }else {
            player.points += calculatePoints(correctAnswers, questions.length);
          }
          return player;
        })
        setPlayers(players);
        setCurrentStage(3);
      }
      if(socket)
        socket.emit('playerFinished', partyCode, totalPoints);

    }, [correctAnswers, questions.length, uuid, apiEndpoint, socket, partyCode, players, setPlayers, setCurrentStage]);

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
            if(currentQuestion+2 === questions.length && partyCode){ // is multiplayer
              await endGame()
            }
          }
        }
      }, 1000);
      
      return () => clearInterval(intervalId);
    }, [seconds, currentQuestion, questions, partyCode, endGame]);

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
      if(currentQuestion+2 === questions.length && partyCode){
        await endGame();
      }
      
    };

    const getAnswers = () => {
      const answers = answersShuffled[currentQuestion];
      if (answers.length > 4) {
        console.log(answers)
        const removeCount = answers.length - 4;
        answers.splice(0, removeCount);
      }
      return answers;
    };

    return (
      <div>
      {(currentQuestion+1) < questions.length && (
        <>
          <div className='question-container' data-testid="question-container">
            <h2 className='question-title' data-testid="question-title">Question {currentQuestion + 1} / {questions.length}</h2>
            <h4 data-testid="question">{questions[currentQuestion].question}</h4>
            <h4 data-testid="seconds">{seconds}</h4>
          </div>
          <div className="answer-grid">
            {getAnswers().map((answer) => {
              const isCorrect = questions[currentQuestion].correctAnswer === answer;
              const buttonColor = (selectedAnswer === answer && !isWaiting) ? (isCorrect ? '#66ff66' : '#ff6666') : '#89c3ff';
              return (
              <button
                key={answer}
                onClick={() => handleAnswerClick(answer, isCorrect)}
                style={{ backgroundColor: buttonColor }}
                data-testid={`answer-${answer}`}
              >
                {answer}
              </button>
            )})}
          </div>
        </>
      )}
      {currentQuestion+1 === questions.length && ( 
        <>
          <p data-testid="result">You answered {correctAnswers} out of {questions.length} questions correctly.</p>
          <p data-testid="points">You earned {calculatePoints(correctAnswers, questions.length)} points.</p>
          {partyCode && <p data-testid="waiting">Waiting for the rest of the players to finish...</p>}
          {players &&<button onClick={() => endGame()} data-testid="next-button">Next</button>}
        </>
      )}
    </div>
    )
}

export default PlayingGame