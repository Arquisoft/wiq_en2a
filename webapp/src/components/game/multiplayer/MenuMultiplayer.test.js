import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import MenuMultiplayer from './MenuMultiplayer';

describe('MenuMultiplayer component', () => {
  // Mock props
  const mockProps = {
    socket: { emit: jest.fn() },
    handleCurrentStage: jest.fn(),
    handlePartyCode: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders menu with correct elements', () => {
    render(<MenuMultiplayer {...mockProps} />);
    
    // Ensure header and buttons are rendered
    expect(screen.getByTestId("title-menu-multiplayer")).toBeInTheDocument();
    expect(screen.getByTestId("multiplayer-create-party-button")).toBeInTheDocument();
    expect(screen.getByTestId("multiplayer-join-party-code")).toBeInTheDocument();
    expect(screen.getByTestId("multiplayer-join-party-button" )).toBeInTheDocument();
  });

  it('calls createParty function when create party button is clicked', () => {
    render(<MenuMultiplayer {...mockProps} />);

    fireEvent.click(screen.getByTestId('multiplayer-create-party-button'));

    expect(mockProps.handleCurrentStage).toHaveBeenCalledWith(2);
    expect(mockProps.socket.emit).toHaveBeenCalledWith('createParty', expect.any(Object));
  });

  it('calls joinParty function with typed code when join party button is clicked', () => {
    render(<MenuMultiplayer {...mockProps} />);

    fireEvent.change(screen.getByTestId('multiplayer-join-party-code'), { target: { value: '123456' } });
    fireEvent.click(screen.getByTestId('multiplayer-join-party-button'));

    expect(mockProps.handlePartyCode).toHaveBeenCalledWith('123456');
    expect(mockProps.socket.emit).toHaveBeenCalledWith('joinParty', '123456', expect.any(Object));
  });
});