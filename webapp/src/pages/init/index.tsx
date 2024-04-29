import  { useState } from 'react';
import { useTranslation } from 'react-i18next';
import Register from '../../components/register/Register';
import Login from '../../components/login/Login';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Init from '../../components/init/Init';
import Box from '@mui/material/Box';
import '../../i18n';

/** Code that was beforehand in App.tsx */
export const InitPage: React.FC<{}> = () =>{
  const { t } = useTranslation();
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
  localStorage.setItem("isAuthenticated", JSON.stringify(false));
  return (
    <Container data-testid="init" component="main" maxWidth="xs">
      <CssBaseline />
      <Box sx={
        {
          minHeight: '100vh', 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }
      }>
          <Typography component="h1" variant="h2" align="center" sx={{ marginBottom: 3 }}>
            {t('app_name')}
          </Typography>
          {showInit ?
            <Init changeView={handleLoginRegisterToggleView}/*  changeGoogleView={handleGoogleViewChange} */ 
            data-testid="init-view"/>
            /* : showGoogleLM ?
            <GoogleLoginMenu goBack={handleGoogleViewChange} /> */
            : showLogin ?
            <Login goBack={handleLoginRegisterToggleView} data-testid="login-view"/>
            : <Register goBack={handleLoginRegisterToggleView} data-testid="register-view" />}
          </Box>
        </Container>
    /* changed the login button to /components/Init.tsx (where the other buttons are)*/
  );
}