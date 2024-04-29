import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import PlayingGame from './PlayingGame';

jest.useFakeTimers();

describe('PlayingGame component', () => {
  it('should handle answering questions and end game correctly', async () => {
    const questions = [
      { uuid: '1',
        question: 'What is the capital of France?',
        correctAnswer: '1',
        incorrectAnswer1: '2',
        incorrectAnswer2: '3',
        incorrectAnswer3: '4', },
      { uuid: '2',
        question: 'What is the capital of Italy?',
        correctAnswer: '1',
        incorrectAnswer1: '2',
        incorrectAnswer2: '3',
        incorrectAnswer3: '4', },
      { uuid: '2',
        question: 'What is the capital of Spain?',
        correctAnswer: '1',
        incorrectAnswer1: '2',
        incorrectAnswer2: '3',
        incorrectAnswer3: '4', },
    ];

    const setCurrentStageMock = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <PlayingGame
        questions={questions}
        setCurrentStage={setCurrentStageMock}
      />
    );

    // Ensure initial rendering
    expect(getByTestId('question-container')).toBeInTheDocument();
    expect(getByTestId('question-title')).toBeInTheDocument();
    expect(getByTestId('question')).toBeInTheDocument();
    expect(getByTestId('seconds')).toBeInTheDocument();

    // Simulate answering question 1
    fireEvent.click(getByTestId('answer-1'));
    jest.advanceTimersByTime(10000);
    await waitFor(() => {
      expect(getByTestId('question-title')).toBeInTheDocument();
      expect(getByTestId('question')).toBeInTheDocument();
      expect(getByTestId('seconds')).toBeInTheDocument();
    });

    // Simulate answering question 2
    fireEvent.click(getByTestId('answer-2'));
    jest.advanceTimersByTime(10000);
    await waitFor(() => {
      expect(getByTestId('question')).toBeInTheDocument();
      expect(getByTestId('seconds')).toBeInTheDocument();
    });

    // Simulate answering question 3
    fireEvent.click(getByTestId('answer-3'));
    jest.advanceTimersByTime(10000);
    await waitFor(() => {
      expect(queryByTestId('question-container')).toBeNull();
      expect(getByTestId('result')).toBeInTheDocument();
      expect(getByTestId('points')).toBeInTheDocument();
    });
  });

  // Add more test cases for edge cases and multiplayer scenarios if applicable
});