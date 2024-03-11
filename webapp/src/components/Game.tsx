
import { Button } from '@mui/material';
import axios from 'axios';
import { useState, ReactNode } from 'react';
interface Question4Answers {
    question: string;
    correctAnswer: string;
    incorrectAnswer1: string;
    incorrectAnswer2: string;
    incorrectAnswer3: string;
}

// Función para crear un juego


const Game = () => {

    const user = localStorage.getItem("user");
    
    const [questions, setQuestions] = useState<Question4Answers[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [elements, setElements] = useState<ReactNode[]>([]);
    const [isGameStarted, setIsGameStarted] = useState(false);

    const createGame = async (players: any) => {

      const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

        try {
          // Datos necesarios para crear el juego
          const requestData = {
            players: players,
          };
      
          // Realizar la solicitud POST al servicio de gateway para crear el juego
          const response = await axios.post(`${apiEndpoint}/createGame`, requestData);
      
          // Si la solicitud es exitosa, se recibe la respuesta del juego creado
          const createdGame = response.data;
      
          // Manejar la respuesta del juego creado (por ejemplo, mostrar un mensaje de éxito)
          console.log('Juego creado:', createdGame);

          setIsGameStarted(true)
          // Retornar la respuesta del juego creado 
          return createdGame;
        } catch (error) {
          // Manejar errores (por ejemplo, mostrar un mensaje de error)
          console.error('Error al crear el juego:', error);
          throw error;
        }
      };


    const submitAnswer = (answer: string) => {
        //problema con los tipos
        if (currentQuestion && answer === questions[currentQuestion]?.correctAnswer) {
            console.log('Respuesta correcta');
        } else {
            console.log('Respuesta incorrecta');
        }
    }

      const addElements = (question:any) => {
         // Crear un array con los botones en el orden original
         const buttons = [
            <button key="button1" onClick={() => submitAnswer(question.correctAnswer)}>{question.correctAnswer}</button>,
            <button key="button2" onClick={() => submitAnswer(question.incorrectAnswer1)}>{question.incorrectAnswer1}</button>,
            <button key="button3" onClick={() => submitAnswer(question.incorrectAnswer2)}>{question.incorrectAnswer2}</button>,
            <button key="button4" onClick={() => submitAnswer(question.incorrectAnswer3)}>{question.incorrectAnswer3}</button>
          ];

        // Aleatorizar el orden de los botones
        buttons.sort(() => Math.random() - 0.5);

        // Crear los elementos HTML con el párrafo y los botones aleatorizados
        const newElements: React.ReactNode[] = [
         <p key="paragraph">{question.question}</p>,
         ...buttons
         ];
    
        // Actualizar el estado con los nuevos elementos
        setElements(newElements);
      };


    const startGame = async () => {
        setQuestions(await createGame(user));
        addElements(nextQuestion());
        setIsGameStarted(true);
    }

    function nextQuestion() {
        setCurrentQuestion(currentQuestion+1);
        return questions[currentQuestion]
    }


    return (
        <div>
            <h1>Game</h1>
            <Button onClick={() => isGameStarted? addElements(nextQuestion()) : startGame()}>
            Nuevo juego
            {elements}
          </Button>
    
          <Button onClick={() => startGame()}>
            Nuevo juego
            {elements}
          </Button>
            
        </div>
        
    )
}

export default Game; // Export the 'Game' component