import { render,screen,within } from '@testing-library/react';
import ScoreboardGame from './ScoreboardGame';

describe('ScoreboardGame component', () => {
  it('renders correctly with single player scores', () => {
    const mockUserScoresSinglePlayer = [
      { username: 'Player 1', points: 100 },
      { username: 'Player 2', points: 80 },
      { username: 'Player 3', points: 120 },
    ];

    const { getByTestId, getAllByTestId } = render(
      <ScoreboardGame userScoresSinglePlayer={mockUserScoresSinglePlayer} />
    );

    // Verificar que el caption está presente
    expect(getByTestId('scoreboard-caption')).toBeInTheDocument();

    // Verificar que todas las filas de la tabla están presentes
    const tableRows = getAllByTestId(/position-\d+/);
    expect(tableRows.length).toBe(mockUserScoresSinglePlayer.length); // No hay fila de encabezado en este caso

    // Verificar que los tres nombres de usuario estén presentes en la vista
    mockUserScoresSinglePlayer.forEach((score) => {
        const usernameCell = screen.getByText(score.username);
        expect(usernameCell).toBeInTheDocument();
    });
  });
});
