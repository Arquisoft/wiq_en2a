import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import LobbyMultiPlayer from './LobbyMultiPlayer';

// Mock Axios
const mockAxios = new MockAdapter(axios);

describe('LobbyMultiPlayer component', () => {
  // Mock props
  const mockProps = {
    socket: { emit: jest.fn() },
    handleCurrentStage: jest.fn(),
    partyCode: '123456',
    users: [{ uuid: '1', username: 'user1', totalPoints: 0, isAdmin: true }],
  };

  beforeEach(() => {
    mockAxios.reset();  
  });

  it('renders lobby with correct elements', async () => {
    const {getAllByTestId} = render(<LobbyMultiPlayer {...mockProps} />);

    // Ensure player items are rendered
    
    const players = getAllByTestId("player-item");

    // Check if there is one player
    expect(players.length).toBeGreaterThan(0);

  });    

  it('clicking exit lobby button calls handleCurrentStage', async () => {
    render(<LobbyMultiPlayer {...mockProps} />);

    fireEvent.click(screen.getByTestId("exit-lobby-button"));

    expect(mockProps.handleCurrentStage).toHaveBeenCalledWith(1);
  });

  it('clicking start game button emits updateQuestions event', async () => {
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
    Object.defineProperty(window, 'localStorage', { value: {
      getItem: jest.fn((key) => {
          return key === 'uuid' ? "1" : key === 'lang' ? "en" : null;
      }),
  } });

    render(<LobbyMultiPlayer {...mockProps} />);

    await waitFor(() => {
      expect(screen.getByTestId("start-game-button")).toBeInTheDocument();
    });

    fireEvent.click(screen.getByTestId("start-game-button"));

    await waitFor(() => {
      expect(mockProps.socket.emit).toHaveBeenCalledWith('updateQuestions', '123456', expect.any(Object));
    });
  });

});