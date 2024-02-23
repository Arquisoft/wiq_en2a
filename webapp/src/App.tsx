import  { useState } from 'react';
import AddUser from './components/AddUser';
import Login from './components/Login';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Init from './components/Init';

function App() {
  const [showLogin, setShowLogin] = useState(true);
  const [showInit, setShowInit] = useState(true);

  const handleToggleView = (state: boolean) => {
    setShowLogin(state);
  };

  const handleLogginRegisterToggleView = (state?:boolean) => {
    setShowInit(!showInit);
    state? handleToggleView(state) : handleToggleView(false)
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 2 }}>
        Conocer y Vencer
      </Typography>
      {showInit ? 
       < Init changeView={handleLogginRegisterToggleView}/>
       : showLogin?
          <Login goBack={handleLogginRegisterToggleView} /> 
          : <AddUser goBack={handleLogginRegisterToggleView}/>}
     
     
    </Container>
  );
}

export default App;
