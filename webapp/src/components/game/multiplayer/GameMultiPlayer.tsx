import { FC, useEffect, useState } from 'react'
import io from 'socket.io-client';
import MenuMultiplayer from './MenuMultiplayer';
import { Container } from '@mui/material';
import LobbyMultiPlayer from './LobbyMultiPlayer';

interface GameMultiPlayerProps {
  
}

export interface SocketProps {
  emit: (event: string, ...args: any[]) => void;
  close: () => void; 
}

const GameMultiPlayer: FC<GameMultiPlayerProps> = ({}) => {

  const SERVER_URL = 'http://localhost:8006';
  const username = localStorage.getItem("username")

  const [socket, setSocket] = useState<SocketProps | null>(null);
  const [stage, setStage] = useState<number>(1)
  const [partyCode, setPartyCode] = useState<string>("");
  const [users, setUsers] = useState<string[]>([]);

  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('partyCreated', (partyCode: string) => {
      console.log(`Party created: ${partyCode}`);
      setPartyCode(partyCode);
      setUsers([username]);
    });

    newSocket.on('joinedParty', (username: string) => {
      console.log(`User ${username} joined the party`);
      console.log(users)
    })

    newSocket.on('lobbyUsers', (users: string[]) => {
      setUsers(users);
      console.log(users)
    });

    newSocket.on('partyNotFound', () => {
      console.log('Party not found');
    });
  
    return () => {
      newSocket.close();
    };
  }, []);

  const handleCurrentStage = (n:number) => {
    setStage(n);
  };

  return (
    <Container sx={{ mt: 9 }}>
      {stage === 1 && <MenuMultiplayer socket={socket} handleCurrentStage={handleCurrentStage} />}
      {stage === 2 && <LobbyMultiPlayer socket={socket} handleCurrentStage={handleCurrentStage} partyCode={partyCode} users={users}/>}
    </Container>
  )
}

export default GameMultiPlayer