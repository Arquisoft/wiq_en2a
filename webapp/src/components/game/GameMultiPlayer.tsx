import { FC, useEffect, useState } from 'react'
import io from 'socket.io-client';

interface GameMultiPlayerProps {
  
}

interface SocketProps {
  emit: (event: string, ...args: any[]) => void;
  close: () => void; 
}

const GameMultiPlayer: FC<GameMultiPlayerProps> = ({}) => {

  const SERVER_URL = 'http://localhost:8006';
  const [socket, setSocket] = useState<SocketProps | null>(null);

  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('partyCreated', (partyCode: string) => {
      console.log(`Party created: ${partyCode}`);
      // Handle the party creation, e.g., store the party code in the state
    });
  
    return () => {
      newSocket.close();
    };
  }, []);

  const createParty = () => {
    socket.emit('createParty');
  };

  return (
    <div>
      <h1>Multiplayer Game</h1>
      <button onClick={createParty}>Create Party</button>
    </div>
  )
}

export default GameMultiPlayer