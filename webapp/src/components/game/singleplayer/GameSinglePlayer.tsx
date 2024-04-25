import axios from 'axios';
import { useState, useEffect } from 'react';
import LobbyGame from './LobbyGameSinglePlayer';
import PlayingGame from './PlayingGameSinglePlayer';
import ScoreboardGame from '../ScoreboardGame';
import { Container } from '@mui/material';

export interface Question4Answers {
  uuid: string
  question: string;
  correctAnswer: string;
  incorrectAnswer1: string;
  incorrectAnswer2: string;
  incorrectAnswer3: string;
}

export interface Player {
  // can be a real player or bot
  username: string;
  points: number;
  isBot: boolean;
}

const GameSinglePlayer = () => {
  const [questions, setQuestions] = useState<Question4Answers[]>([]);
  const [currentStage, setCurrentStage] = useState(1);
  const [players, setPlayers] = useState<Player[]>([]);

  const username = localStorage.getItem("username");
  const uuid = localStorage.getItem("userUUID");
  const [fetched, setFetched] = useState(false);

  useEffect(() => {
    const fetchQuestions = async () => {
      //const apiEndpoint = 'http://conoceryvencer.xyz:8000'
      const apiEndpoint = process.env.API_ENDPOINT || 'http://localhost:8000';

      try {
        setPlayers([
          {
            username: username,
            points: 0,
            isBot: false,
          }
        ])
        const requestData = {
          players: [{
            uuid: uuid,
          }],
        };
    
        const lang = localStorage.getItem("lang")
        const response = await axios.post(`${apiEndpoint}/createGame/${lang}`, requestData);
    
        setQuestions(response.data);
        setCurrentStage(1);
        setFetched(true);
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
      }
    };

    if (!questions.length && !fetched) {
      fetchQuestions();
    }
  }, [questions.length, uuid, username, fetched]);

  if (!username) return <p>Error</p>;

  const handlePlayers = (Players:Player[]) => {
    setPlayers(Players);
  };

  const handleCurrentStage = (n:number) => {
    setCurrentStage(n);
  };

  return (
    <Container sx={{ mt: 9 }}>
      {currentStage === 1 && (<LobbyGame players={players} setPlayers={handlePlayers} setCurrentStage={handleCurrentStage} isFetched={fetched}/>)}
      {currentStage === 2 && (<PlayingGame questions={questions} setCurrentStage={handleCurrentStage} setPlayers={handlePlayers} players={players}/>)}
      {currentStage === 3 && (<ScoreboardGame userScoresSinglePlayer={players}/> )}
    </Container>
  );
};

export default GameSinglePlayer;
