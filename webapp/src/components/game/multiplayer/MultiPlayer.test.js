import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import GameMultiPlayer from './GameMultiPlayer';

const mockAxios = new MockAdapter(axios);

describe('Multiplayer Manu component', () => {
  
  beforeEach(() => {
    mockAxios.reset();
  });

  it('user creates a party', async () => {

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
            return key === 'username' ? 'testUser' : key === 'score' ? '100' : key === 'uuid' ? '111111' : null;
        }),
    };
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });

    const multiplayer = render(
        <GameMultiPlayer/>
      );  
    // Wait for the Snackbar to be open
    await waitFor(() => {
      expect(screen.getByTestId("menu-multiplayer")).toBeInTheDocument();
    });


    fireEvent.click(screen.getByTestId("multiplayer-create-party-button"));

    expect(screen.getByTestId("lobby-multiplayer")).toBeInTheDocument();
  });

  
})