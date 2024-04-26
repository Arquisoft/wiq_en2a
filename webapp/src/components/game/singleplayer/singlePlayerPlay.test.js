import { render, fireEvent, waitFor,screen } from '@testing-library/react';
import PlayingGame from './PlayingGameSinglePlayer';

// Mock de las props necesarias para el componente
const mockProps = {
  questions: [
    { question: 'Question 1?', correctAnswer: 'Answer 1', incorrectAnswer1: 'Answer 2',
     incorrectAnswer2: 'Answer 3', incorrectAnswer3: 'Answer 4' },
     { question: 'Question 2?', correctAnswer: 'Answer 1', incorrectAnswer1: 'Answer 2',
     incorrectAnswer2: 'Answer 3', incorrectAnswer3: 'Answer 4' }
  ],
  setCurrentStage: jest.fn(),
  setPlayers: jest.fn(),
  players: [],
};

describe('PlayingGame component', () => {
  it('renders correctly', async () => {
    const { getByTestId } = render(<PlayingGame {...mockProps} />);
    const questionTitle = getByTestId('question-title');
    expect(questionTitle).toBeInTheDocument();
    
  });

  
it('handles answer clicks correctly', async () => {
    const { getByTestId } = render(<PlayingGame {...mockProps} />);
    const answerButton = getByTestId('answer-Answer 1');
    fireEvent.click(answerButton);
    // Espera a que el componente actualice su estado
    await waitFor(() => {
            expect(screen.getByTestId('result')).toBeInTheDocument();
    });

});
  
  
});
