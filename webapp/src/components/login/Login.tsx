import { useState, KeyboardEvent } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Snackbar, Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";


type ActionProps = {
    goBack:()=> void;
}

const Login = (props: ActionProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  //const apiEndpoint = 'http://conoceryvencer.xyz:8000'
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT;

  const handleReturnButtonClick = () => { 
    document.title = "Conocer y Vencer";
    props.goBack();
  };

  async function loginUser () {

    try {
      const user = await axios.post(`${apiEndpoint}/login`, { username, password });
      console.log(user.data);
  
      localStorage.setItem("username", user.data.username);
      localStorage.setItem("score", user.data.totalScore);
      localStorage.setItem("nWins", user.data.nWins);
      localStorage.setItem("uuid", user.data.uuid);
      localStorage.setItem("isAuthenticated", JSON.stringify(true));
      // Extract data from the response
      localStorage.setItem('userUUID', user.data.uuid);
      localStorage.setItem("lang", navigator.language.slice(0, 2));

      setOpenSnackbar(true);
      navigate("/game")
    } catch (error:any) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if(event.key === 'Enter'){
      loginUser();
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 3 }}>
        <div>
          <Typography component="h1" variant="h5">
            {t('login')}
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            label={t('label_username')}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label={t('label_password')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyPress}
            sx={{ marginBottom: '30px' }}
          />
          <Stack direction="column" spacing={0.5}>
            <Button variant='contained'  color="primary" onClick={loginUser}>
              {t('login')}
            </Button>
            <Button variant='contained' color="primary" onClick={handleReturnButtonClick}>
              {t('return')}
            </Button>
          </Stack>
          <Snackbar data-testid="login-successfull-snackbar" open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message={`${t('login_message')}`} />
          {error && (
            <Snackbar data-testid="login-error-snackbar" open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
          )}
        </div>
    </Container>
  );
};

export default Login;