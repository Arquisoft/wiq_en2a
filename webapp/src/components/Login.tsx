// src/components/Login.js
import  {  useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Snackbar, Button, Stack } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate } from "react-router-dom";
import { UserData } from 'src/App';
import { User } from "../common/types";


type ActionProps = {
    goBack:()=> void;
}



const Login = (props: ActionProps) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setAuthUser} = UserData();
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

  const loginUser = async () => {

    try {
      await axios.post(`${apiEndpoint}/login`, { username, password });
      
      var user:User = {
        name: username, 
        points: "10", 
        isAuthenticated: true
      }


      setAuthUser(user);
      // Extract data from the response

      setOpenSnackbar(true);
      navigate("/game")
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };


  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
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
          <Stack direction="column" spacing={2}>
            <Button  color="primary" onClick={loginUser}>
              {t('login')}
            </Button>
            <Button color="primary" onClick={props.goBack}>
              {t('go_back')}
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
