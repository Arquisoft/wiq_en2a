export default function shuffleAnswers(questions){
    return questions.map((question) => {
      const answers = [question.correctAnswer, question.incorrectAnswer1, question.incorrectAnswer2, question.incorrectAnswer3];
      for (let i = answers.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [answers[i], answers[j]] = [answers[j], answers[i]];
      }
      return answers;
    });
  }