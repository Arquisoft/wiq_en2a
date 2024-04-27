import { render, fireEvent, getByText } from '@testing-library/react';
import LobbyGame from './LobbyGameSinglePlayer';

describe('LobbyGame component', () => {
  let mockSetPlayers;
  let mockSetCurrentStage;
  let mockPlayers;

  beforeEach(() => {
    mockSetPlayers = jest.fn();
    mockSetCurrentStage = jest.fn();
    mockPlayers = [
      { username: 'Player 1', points: 0, isBot: false },
      { username: 'Player 2', points: 0, isBot: true },
    ];
  });

  it('renders correctly', () => {
    const { getByTestId, getAllByTestId } = render(
      <LobbyGame
        setPlayers={mockSetPlayers}
        players={mockPlayers}
        setCurrentStage={mockSetCurrentStage}
        isFetched={true}
      />
    );

    // Check if the lobby screen is rendered
    expect(getByTestId('lobby-screen')).toBeInTheDocument();

    // Check if player items are rendered correctly
    const playerItems = getAllByTestId('player-item');
    expect(playerItems).toHaveLength(mockPlayers.length);

    // Check if add bot button is rendered
    const addBotButton = getByTestId('add-bot-button');
    expect(addBotButton).toBeInTheDocument();

    // Check if start game button is rendered and enabled
    const startGameButton = getByTestId('start-game-button');
    expect(startGameButton).toBeInTheDocument();
    expect(startGameButton).toBeEnabled();
  });

  it('adds a bot player correctly', () => {
    const { getByTestId, getAllByTestId } = render(
      <LobbyGame
        setPlayers={mockSetPlayers}
        players={mockPlayers}
        setCurrentStage={mockSetCurrentStage}
        isFetched={true}
      />
    );

    // Click on the add bot button
    const addBotButton = getByTestId('add-bot-button');
    fireEvent.click(addBotButton);

    // Find all elements that contain the text "Bot"
  const botElements = getAllByTestId('player-item');

  // Check if at least one element containing "Bot" text is found
  expect(botElements.length).toBeGreaterThan(1);
});

});
