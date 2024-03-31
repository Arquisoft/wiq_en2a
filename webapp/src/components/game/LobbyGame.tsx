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
      <table>
  <thead>
    <tr>
      <th scope="col" id="playerAvatar"></th>
      <th scope="col" id="playerUsername">Username</th>
      <th scope="col" id="playerPoints">Total points</th>
      <th scope="col" id="playerBotOptions"></th>
    </tr>
  </thead>
  <tbody>
    {players.map((player, index) => (
      <tr key={player.username} className='player-item'>
        <td headers='playerAvatar'><img src={"https://robohash.org/"+player.username+".png"} alt={player.username} /></td>
        <td headers='playerUsername'>{player.username}</td>
        <td headers='playerPoints'>Total points: {player.points}</td>
        <td headers='playerBotOptions'>
          {player.isBot ? (
            <button onClick={() => deletePlayer(index)} className="delete-button">Delete</button>
          ) : (
            <button className="delete-button" disabled>Delete</button>
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>
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