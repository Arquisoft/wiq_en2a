import  { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Snackbar, Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import './Login.scss';

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
  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const loginUser = async () => {
    try {
      await axios.post(`${apiEndpoint}/login`, { username, password });
      // Extract data from the response
      navigate("/game");
      setOpenSnackbar(true);
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

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 3 }}>
        <div>
          <Typography component="h1" variant="h5">
            {t('login')}
          </Typography>
          <TextField
            margin="normal"
            fullWidth
            label="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Stack direction="column">
            <Button  color="primary" onClick={loginUser}>
              {t('login')}
            </Button>
            <Button color="primary" onClick={handleReturnButtonClick}>
              {t('return')}
            </Button>
          </Stack>
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar} message="Login successful" />
          {error && (
            <Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError('')} message={`Error: ${error}`} />
          )}
        </div>
    </Container>
  );
};

export default Login;
