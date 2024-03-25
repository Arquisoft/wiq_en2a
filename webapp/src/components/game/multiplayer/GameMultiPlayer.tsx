import { FC, useEffect, useState } from 'react'
import io from 'socket.io-client';
import MenuMultiplayer from './MenuMultiplayer';

interface GameMultiPlayerProps {
  
}

export interface SocketProps {
  emit: (event: string, ...args: any[]) => void;
  close: () => void; 
}

const GameMultiPlayer: FC<GameMultiPlayerProps> = ({}) => {

  const SERVER_URL = 'http://localhost:8006';
  const [socket, setSocket] = useState<SocketProps | null>(null);
  const [stage, setStage] = useState<number>(1)

  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('partyCreated', (partyCode: string) => {
      console.log(`Party created: ${partyCode}`);
    });
  
    return () => {
      newSocket.close();
    };
  }, []);

  const handleCurrentStage = (n:number) => {
    setStage(n);
  };

  return (
    <div>
      {stage === 1 && <MenuMultiplayer socket={socket} handleCurrentStage={handleCurrentStage} />}
      
    </div>
  )
}

export default GameMultiPlayer