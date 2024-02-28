import  { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AddUser from './components/AddUser';
import Login from './components/Login';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Init from './components/Init';
import './i18n';
import GLoginButton from './components/GLoginButton';

function App() {
  const { t } = useTranslation()
  // const [showGoogleLM, setShowGoogleLM] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [showInit, setShowInit] = useState(true);

  const handleToggleView = (state: boolean) => {
    setShowLogin(state);
  };

  const handleLoginRegisterToggleView = (state?:boolean) => {
    setShowInit(!showInit);
    state? handleToggleView(state) : handleToggleView(false)
  };

  /* const handleGoogleViewChange = () => {
    setShowGoogleLM(!showGoogleLM);
    setShowInit(!showInit);
  } */

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 2 }}>
        {t('app_name')}
      </Typography>

      {showInit ? 
       <Init changeView={handleLoginRegisterToggleView}/*  changeGoogleView={handleGoogleViewChange} */ />
       /* : showGoogleLM ?
        <GoogleLoginMenu goBack={handleGoogleViewChange} /> */
          : showLogin ?
            <Login goBack={handleLoginRegisterToggleView} /> 
            : <AddUser goBack={handleLoginRegisterToggleView} />}
      
      <GLoginButton /* Añadido sin usar typescript ya que no da problemas con el componente de google auth *//>
     
     
    </Container>
  );
}

export default App;
