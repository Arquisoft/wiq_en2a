import  { useState, KeyboardEvent } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Snackbar, Stack, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './Register.scss';
import { useNavigate } from "react-router-dom";

//const apiEndpoint = 'http://74.234.241.249:8000'
const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

type ActionProps = {
  goBack:()=> void;
}

const Register = (props:ActionProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  async function addUser () {
    try {
      // checkear que el username no exista (tiene que ser unico)
      await axios.post(`${apiEndpoint}/adduser`, { username, password });
      setOpenSnackbar(true);
      localStorage.clear();
      const user = await axios.post(`${apiEndpoint}/login`, { username, password });
  
      console.log(user.data);
      localStorage.setItem("username", user.data.username);
      localStorage.setItem("score", user.data.totalScore);
      localStorage.setItem("nWins", user.data.nWins);
      localStorage.setItem("uuid", user.data.uuid);
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
      // Extract data from the response
      localStorage.setItem('userUUID', user.data.uuid);

      setOpenSnackbar(true);
      navigate("/game")
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleReturnButtonClick = () => {
    document.title = "Conocer y Vencer";
    props.goBack();
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if(event.key === 'Enter'){
        addUser();
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 3 }}>
      <Typography component="h1" variant="h5">
        {t('register')}
      </Typography>
      <TextField
        name="username"
        margin="normal"
        fullWidth
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <TextField
        name="password"
        margin="normal"
        fullWidth
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={handleKeyPress}
      />
      <Stack direction="column">
        <Button color="primary" onClick={addUser}>
          {t('register')}
        </Button>
        <Button color="primary" onClick={handleReturnButtonClick}>
          {t('return')}
        </Button>
      </Stack>
      <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="You registered successfully" id='successUserAdd'/>
      {error && (
        <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
      )}
    </Container>
  );
};

export default Register;