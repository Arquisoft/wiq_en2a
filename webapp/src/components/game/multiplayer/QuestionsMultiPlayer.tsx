import { FC, useMemo, useState } from 'react'
import { SocketProps } from './GameMultiPlayer';
import { Question4Answers } from '../singleplayer/GameSinglePlayer';
import axios from 'axios';
import '../questions-game.scss';
import { useTranslation } from 'react-i18next';

interface QuestionsMultiPlayerProps {
  socket: SocketProps;
  handleCurrentStage: (n: number) => void
  questions: Question4Answers[]
  partyCode: string
}


const QuestionsMultiPlayer: FC<QuestionsMultiPlayerProps> = ({ socket, questions, partyCode }) => {

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
  const apiEndpoint = 'http://localhost:8000'
  //const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const [isWaiting, setIsWaiting] = useState<boolean>(false);

  const { t } = useTranslation();


  const handleAnswerClick = async (answer: string, isCorrect: boolean) => {

    if (!isWaiting) {
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

    if (currentQuestion + 2 === questions.length) {
      const totalPoints = calculatePoints(correctAnswers, questions.length);
      // the player has finished the game
      // update stats for each player
      const requestData = {
        "players": [{
          "uuid": uuid,
          "nCorrectAnswers": correctAnswers,
          "nWrongAnswers": questions.length - correctAnswers,
          "totalScore": totalPoints,
          "isWinner": false
        }]
      }

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
      {(currentQuestion + 1) < questions.length && (
        <>
          <div className="question-container">
            <h2 className="question-title">{t('questions_multiplayer_question')}{currentQuestion + 1} / {questions.length}</h2>
            <h4>{questions[currentQuestion].question}</h4>
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
              )
            }
            )}
          </div>
        </>
      )}
      {currentQuestion + 1 === questions.length && (
        <>
          <p>{t('questions_multiplayer_you_answered')}{correctAnswers}{t('questions_multiplayer_out_of')}{questions.length}{t('questions_multiplayer_questions_correctly')}</p>
          <p>{t('questions_multiplayer_you_earned')}{calculatePoints(correctAnswers, questions.length)}{t('questions_multiplayer_points')}</p>
          <p>{t('questions_multiplayer_waiting_players')}</p>
        </>
      )}
    </div>
  )
}

export default QuestionsMultiPlayer