import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GameLayout from './GameLayout';
import { MemoryRouter } from 'react-router-dom'; // Importa MemoryRouter

describe('GameLayout component', () => {
  it('renders Game by default', () => {
    render(
        <MemoryRouter>
            <GameLayout />
        </MemoryRouter>
);
    expect(screen.getByTestId('game-header')).toBeInTheDocument();
    expect(screen.getByTestId('game-link')).toBeInTheDocument();
    expect(screen.getByTestId('groups-link')).toBeInTheDocument();
    expect(screen.getByTestId('scoreboard-link')).toBeInTheDocument();
    
  });

  it('renders GroupsPage when Groups link is clicked', () => {
    render(
        <MemoryRouter>
            <GameLayout />
        </MemoryRouter>
);
    waitFor(() => {
        fireEvent.click(screen.getByTestId('groups-link'));
        expect(screen.queryByTestId('game-component')).toBeNull();
        expect(screen.getByTestId('groups-page-component')).toBeInTheDocument();
        expect(screen.queryByTestId('scoreboard-component')).toBeNull();
    });
   
  });

  it('renders Scoreboard when Scoreboard link is clicked', () => {
    
    render(
      <MemoryRouter>
    <GameLayout />
    </MemoryRouter>
    );
    waitFor(() => {
        fireEvent.click(screen.getByTestId('scoreboard-link'));
        expect(screen.queryByTestId('game-component')).toBeNull();
        expect(screen.queryByTestId('groups-page-component')).toBeNull();
        expect(screen.getByTestId('scoreboard-component')).toBeInTheDocument();
    });
    
  });
});
