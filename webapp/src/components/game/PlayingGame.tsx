import { FC, useState } from 'react'
import { Question4Answers } from './Game'

interface PlayingGameProps {
  questions: Question4Answers[]
}

const PlayingGame: FC<PlayingGameProps> = ({questions}) => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [correctAnswers, setCorrectAnswers] = useState(0);

    const handleAnswerClick = (answer: string) => {
      console.log(answer)
      console.log(questions[currentQuestion].correctAnswer)
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
                //disabled={selectedAnswer !== null}
                onClick={() => handleAnswerClick(answer)}
              >
                {answer}
              </button>
            ))}
          </div>
        </>
      )}
      {currentQuestion+1 === questions.length && ( // Display message after all questions
        <>
          <p>You answered {correctAnswers} out of {questions.length} questions correctly.</p>
          <p>You earned {calculatePoints(correctAnswers, questions.length)} points.</p>
          <button>Next</button>
        </>
      )}
    </div>
    )
}

export default PlayingGame