function expectQuestionProperties(question) {
    expect(question).toHaveProperty('uuid');
    expect(question).toHaveProperty('question');
    expect(question).toHaveProperty('correctAnswer');
    expect(question).toHaveProperty('incorrectAnswer1');
    expect(question).toHaveProperty('incorrectAnswer2');
    expect(question).toHaveProperty('incorrectAnswer3');
    expect(typeof question.uuid).toBe('string');
    expect(typeof question.question).toBe('string');
    expect(typeof question.correctAnswer).toBe('string');
    expect(typeof question.incorrectAnswer1).toBe('string');
    expect(typeof question.incorrectAnswer2).toBe('string');
    expect(typeof question.incorrectAnswer3).toBe('string');
  }

module.exports = expectQuestionProperties;