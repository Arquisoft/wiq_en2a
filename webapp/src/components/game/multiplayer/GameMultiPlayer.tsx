import { FC, useEffect, useState } from 'react'
import io from 'socket.io-client';
import MenuMultiplayer from './MenuMultiplayer';
import { Container } from '@mui/material';
import LobbyMultiPlayer from './LobbyMultiPlayer';
import { Question4Answers } from '../singleplayer/GameSinglePlayer';
import QuestionsMultiPlayer from './QuestionsMultiPlayer';
import ScoreboardGame from '../ScoreboardGame';

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
  points: number;
}

const GameMultiPlayer: FC<GameMultiPlayerProps> = () => {

  //const SERVER_URL = 'http://conoceryvencer.xyz:8006';
  const SERVER_URL = process.env.REACT_APP_MULTIPLAYER_ENDPOINT || 'http://localhost:8006';

  const [socket, setSocket] = useState<SocketProps | null>(null);
  const [stage, setStage] = useState<number>(1)
  const [partyCode, setPartyCode] = useState<string>("");
  const [users, setUsers] = useState<UserPlayer[]>([]);
  const [questions, setQuestions] = useState<Question4Answers[]>([]);
  const [sortedUsersByPoints, setSortedUsersByPoints] = useState<PlayerWithPoints[]>([])

  const shuffleQuestions = (questions: Question4Answers[]): Question4Answers[] => {
    return questions.map((question) => {
      const { correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3 } = question;
      const answers = [correctAnswer, incorrectAnswer1, incorrectAnswer2, incorrectAnswer3];
  
      // Shuffle the order of incorrect answers (answers excluding correctAnswer)
      for (let i = answers.length - 1; i > 1; i--) {
        const j = Math.floor(Math.random() * (i - 1) + 1); // Exclude correctAnswer from shuffling
        [answers[i], answers[j]] = [answers[j], answers[i]];
      }
  
      return {
        ...question,
        incorrectAnswer1: answers[1],
        incorrectAnswer2: answers[2],
        incorrectAnswer3: answers[3],
      };
    });
  };

  const handleAllPlayersFinished = async (playersWithPoints: PlayerWithPoints[]) => {
    await new Promise<void>((resolve) => {
        setTimeout(resolve, 1000); // Using resolve directly as the callback
    });
    setSortedUsersByPoints(playersWithPoints);
    setStage(4);
};

  useEffect(() => {
    const newSocket = io(SERVER_URL);
    setSocket(newSocket);

    newSocket.on('partyCreated', (partyCode: string) => {
      console.log(`Party created: ${partyCode}`);
      setPartyCode(partyCode);
    });

    newSocket.on('joinedParty', (user: UserPlayer) => {
      setStage(2);
    })

    newSocket.on('lobbyUsers', (users: UserPlayer[]) => {
      setUsers(users);
    });

    newSocket.on('partyNotFound', () => {
      console.log('Party not found');
    });

    newSocket.on('allPlayersFinished', handleAllPlayersFinished);

    newSocket.on('questionsUpdated', (questions: Question4Answers[]) => {
      const shuffledquestions = shuffleQuestions(questions);
      setQuestions(shuffledquestions);
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
      {stage === 4 && <ScoreboardGame userScoresMultiPlayer={sortedUsersByPoints}/>}
    </Container>
  )
}

export default GameMultiPlayer