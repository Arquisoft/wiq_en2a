import { FC, useEffect, useState } from 'react'
import io from 'socket.io-client';
import MenuMultiplayer from './MenuMultiplayer';
import { Container } from '@mui/material';
import LobbyMultiPlayer from './LobbyMultiPlayer';
import { Question4Answers } from '../singleplayer/GameSinglePlayer';
import QuestionsMultiPlayer from './QuestionsMultiPlayer';
import ScoreboardMultiPlayer from './ScoreboardMultiPlayer';

interface GameMultiPlayerProps {
  
}

export interface SocketProps {
  emit: (event: string, ...args: any[]) => void;
  close: () => void; 
}

export interface UserPlayer {
  username: string;
  totalPoints: number;
  uuid: string;
  isAdmin: boolean;
}

export interface PlayerWithPoints {
  username: string;
  totalPoints: number;
}

const GameMultiPlayer: FC<GameMultiPlayerProps> = () => {

  const SERVER_URL = 'http://localhost:8006';
  const username = localStorage.getItem("username")

  const [socket, setSocket] = useState<SocketProps | null>(null);
  const [stage, setStage] = useState<number>(1)
  const [partyCode, setPartyCode] = useState<string>("");
  const [users, setUsers] = useState<UserPlayer[]>([]);
  const [questions, setQuestions] = useState<Question4Answers[]>([]);
  const [sortedUsersByPoints, setSortedUsersByPoints] = useState<PlayerWithPoints[]>([])

  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('partyCreated', (partyCode: string) => {
      console.log(`Party created: ${partyCode}`);
      setPartyCode(partyCode);
    });

    newSocket.on('joinedParty', (user: UserPlayer) => {
      console.log(user)
      console.log(`User ${username} joined the party`);
      setStage(2);
      console.log(users)
    })

    newSocket.on('lobbyUsers', (users: UserPlayer[]) => {
      setUsers(users);
      console.log(users)
    });

    newSocket.on('partyNotFound', () => {
      console.log('Party not found');
    });

    newSocket.on('allPlayersFinished', (playersWithPoints:PlayerWithPoints[]) => {
      console.log(playersWithPoints)
      setSortedUsersByPoints(playersWithPoints);
      setStage(4);
    })

    newSocket.on('questionsUpdated', (questions: Question4Answers[]) => {
      console.log('questions recieved from server')
      console.log(questions);
      setQuestions(questions);
      setStage(3);
    })
  
    return () => {
      newSocket.close();
    };
  }, []);

  const handleCurrentStage = (n:number) => {
    setStage(n);
  };

  const handlePartyCode = (n:string) => {
    setPartyCode(n)
  };

  return (
    <Container sx={{ mt: 9 }}>
      {stage === 1 && <MenuMultiplayer socket={socket} handleCurrentStage={handleCurrentStage} handlePartyCode={handlePartyCode}/>}
      {stage === 2 && <LobbyMultiPlayer socket={socket} handleCurrentStage={handleCurrentStage} partyCode={partyCode} users={users}/>}
      {stage === 3 && <QuestionsMultiPlayer socket={socket} handleCurrentStage={handleCurrentStage} questions={questions} partyCode={partyCode}/>}
      {stage === 4 && <ScoreboardMultiPlayer/>}
    </Container>
  )
}

export default GameMultiPlayer