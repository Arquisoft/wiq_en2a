import { FC, useState } from 'react'
import { Player, Question4Answers } from './Game'
import axios from 'axios';

interface PlayingGameProps {
  questions: Question4Answers[]
  setCurrentStage: (n: number) => void;
  setPlayers: (players:Player[]) => void;
  players: Player[];
}

const PlayingGame: FC<PlayingGameProps> = ({questions, setCurrentStage, setPlayers, players}) => {
    
    const uuid = localStorage.getItem("userUUID");
    const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    const handleAnswerClick = (answer: string) => {
      if(questions[currentQuestion].correctAnswer === answer){
        setCorrectAnswers(correctAnswers + 1);
        
      }
      setCurrentQuestion(currentQuestion + 1);
    };

    const calculatePoints = (correctAnswers: number, totalQuestions: number) => {
      const incorrectQuestions = totalQuestions - correctAnswers;
      const points = correctAnswers * 100 - incorrectQuestions * 25;
      return points;
    }

    const handleNext = async () => {
      const randomPoints = Math.floor(Math.random() * (10000 - 100 + 1) / 50) * 50 + 100;
      players.map(player => {
        if(player.isBot){
          player.points += randomPoints;
        }else {
          player.points += calculatePoints(correctAnswers, questions.length);
        }
        return player;
      })
      setPlayers(players);
      setCurrentStage(4);
      const sorted = players.sort((a, b) => b.points - a.points);
      const requestData ={ "players": [{
        "uuid": uuid,
        "nCorrectAnswers": correctAnswers,
        "nWrongAnswers": questions.length - correctAnswers,
        "totalScore": calculatePoints(correctAnswers, questions.length),
        "isWinner": !sorted[0].isBot
      }]}

      await axios.post(`${apiEndpoint}/updateStats`, requestData);
    }

    const getShuffledAnswers = () => {
      const answers = [
        questions[currentQuestion].correctAnswer,
        questions[currentQuestion].incorrectAnswer1,
        questions[currentQuestion].incorrectAnswer2,
        questions[currentQuestion].incorrectAnswer3,
      ];
  
      // Fisher-Yates Shuffle for randomizing answer order
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
          <button onClick={() => handleNext()}>Next</button>
        </>
      )}
    </div>
    )
}

export default PlayingGame