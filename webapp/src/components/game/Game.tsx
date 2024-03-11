import axios from 'axios';
import { useEffect, useState } from 'react';
import MenuGame from './MenuGame';
import LobbyGame from './LobbyGame';
import PlayingGame from './PlayingGame';
import ScoreboardGame from './ScoreboardGame';
export interface Question4Answers {
    question: string;
    correctAnswer: string;
    incorrectAnswer1: string;
    incorrectAnswer2: string;
    incorrectAnswer3: string;
}

export interface User {
  createdAt: string;
  nCorrectAnswers: number;
  nWins: number;
  nWrongAnswers: number;
  totalScore: number;
  username: string;
  uuid: string;
}

export interface Player {
  // can be a real player or bot
  username: string;
  points: number;
  isBot: boolean;
}


const Game = () => {

    const [questions, setQuestions] = useState<Question4Answers[]>([]);
    const [currentStage, setCurrentStage] = useState(1);
    const [players, setPlayers] = useState<Player[]>([]);

    const username = localStorage.getItem("username");
    const uuid = localStorage.getItem("userUUID");

    useEffect(() => {
      createGame();
    },[])

    if(!username) return <p>error</p>;
    
    const createGame = async () => {

      const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

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
      
          const response = await axios.post(`${apiEndpoint}/createGame`, requestData);
      
          const createdGame = response.data;

          setQuestions(createdGame.questions);
          console.log('Juego creado:', createdGame);

          
          setCurrentStage(1);
          return createdGame;
        } catch (error) {
          console.error('Error al crear el juego:', error);
          throw error;
        }
      };

      const handlePlayers = (Players:Player[]) => {
        return setPlayers(Players);
      }

      const handleCurrentStage = (n:number) => {
        return setCurrentStage(n);
      }

      
    return (
      <div>
        {currentStage === 1 && (<MenuGame setCurrentStage={handleCurrentStage} />)}
        {currentStage === 2 && (<LobbyGame players={players} setPlayers={handlePlayers} setCurrentStage={handleCurrentStage}/>)}
        {currentStage === 3 && (<PlayingGame questions={questions}/>)}
        {currentStage === 4 && (<ScoreboardGame userScores={players}/>)}
      </div>
        
    )
}

export default Game;