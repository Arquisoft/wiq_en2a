const calculatePoints = (correctAnswers: number, totalQuestions: number) => {
    const incorrectQuestions = totalQuestions - correctAnswers;
    const points = correctAnswers * 100 - incorrectQuestions * 25;
    return points;
  }

export default calculatePoints;