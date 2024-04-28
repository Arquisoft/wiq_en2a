import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import GameMultiPlayer from './GameMultiPlayer';

const mockAxios = new MockAdapter(axios);

describe('Multiplayer Lobby component', () => {
  
  beforeEach(() => {
    mockAxios.reset();
  });

  it('user creates a party', async () => {
  
    const mockResponse = { data: [
        {
          uuid: '1',
          question: '56*54-3',
          correctAnswer: '3021',
          incorrectAnswer1: '3000',
          incorrectAnswer2: '3022',
          incorrectAnswer3: '3031',
        }
    ] };
    mockAxios.onPost('http://localhost:8000/createGame/en').reply(200, mockResponse);

    // Mock local storage
    Object.defineProperty(window, 'localStorage', { value: {
        getItem: jest.fn((key) => {
            return key === 'username' ? 'userForTest' : key === 'score' ? '0' : key === 'uuid' ? '2222' : null;
        }),
    } });

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