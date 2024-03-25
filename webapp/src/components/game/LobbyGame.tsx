import { FC } from 'react'
import { Player } from './GameSinglePlayer';
import './LobbyGame.css';

interface LobbyGameProps {
  setPlayers: (players:Player[]) => void;
  players: Player[];
  setCurrentStage: (n: number) => void;
  isFetched: boolean;
}

const LobbyGame: FC<LobbyGameProps> = ({setPlayers, players, setCurrentStage, isFetched}) => {

  const addBotPlayer = () => {
    if (players.length < 4) { 
      
      setPlayers([...players, { username: `Bot ${players.length + 1}`, points: 0, isBot: true }]);
    }
  };

  const deletePlayer = (playerIndex: number) => {
    const newPlayers = [...players]; 
    newPlayers.splice(playerIndex, 1);
    setPlayers(newPlayers);
  };

  return (
    <div className='lobby-container'>
      <h2 className='lobby-title'>Lobby</h2>
      {players.map((player, index) => (
        <div key={player.username} className='player-item'>
          <p>Name: {player.username}</p>
          <p>Total points: {player.points}</p>
          {player.isBot && <button onClick={() => deletePlayer(index)} className="delete-button">Delete</button>}
          {!player.isBot && <button onClick={() => deletePlayer(index)} className="delete-button" disabled>Delete</button>}
        </div>
      ))}
      <div className='button-container'>
        <button disabled={players.length === 4} onClick={addBotPlayer} className="add-bot-button">
          Add Bot Player
        </button>
        {isFetched && <button className="start-game-button" onClick={() => setCurrentStage(2)}>
            Start Game
        </button>}
        {!isFetched && <button className="start-game-button" onClick={() => setCurrentStage(2)} disabled>
            Loading questions...
        </button>}
      </div>
    </div>
  );
};

export default LobbyGame