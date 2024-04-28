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

});