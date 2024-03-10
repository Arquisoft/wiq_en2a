import  { useState } from 'react';
import axios from 'axios';
import { Container, Typography, TextField, Snackbar, Stack, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import './Register.scss';

const apiEndpoint = process.env.REACT_APP_API_ENDPOINT || 'http://localhost:8000';

type ActionProps = {
  goBack:()=> void;
}

const Register = (props:ActionProps) => {
  const { t } = useTranslation();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const addUser = async () => {
    try {
      // checkear que el username no exista (tiene que ser unico)
      await axios.post(`${apiEndpoint}/adduser`, { username, password });
      setOpenSnackbar(true);
    } catch (error) {
      setError(error.response.data.error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>
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
      />
      <Stack direction="column">
        <Button color="primary" onClick={addUser}>
          {t('register')}
        </Button>
        <Button color="primary" onClick={props.goBack}>
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