import React from 'react';
import { render, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import GameSinglePlayer from './GameSinglePlayer';

describe('GameSinglePlayer component', () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it('renders correctly', async () => {
    const mockQuestions = [
      {
        uuid: '1',
        question: 'What is the capital of France?',
        correctAnswer: 'Paris',
        incorrectAnswer1: 'London',
        incorrectAnswer2: 'Berlin',
        incorrectAnswer3: 'Madrid',
      }
    ];

    const mockResponse = { data: mockQuestions };
    mockAxios.onPost('http://localhost:8000/createGame/en').reply(200, mockResponse);

    // Mock local storage
    const localStorageMock = {
      getItem: jest.fn((key) => {
        return key === 'username' ? 'testUser' : null;
      }),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    const { getByTestId } = render(<GameSinglePlayer />);

    // Wait for the questions to be fetched and the lobby screen to be rendered
    await waitFor(() => {
      expect(getByTestId('lobby-screen')).toBeInTheDocument();
    });
  });

  it('handles error if username is missing', () => {
    // Mock local storage to simulate missing username
    const localStorageMock = {
      getItem: jest.fn((key) => {
        return null;
      }),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    const { getByTestId } = render(<GameSinglePlayer />);

    // Expect error message to be rendered
    expect(getByTestId("game_single_player_error")).toBeInTheDocument();
  });
});
