import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./Router";

function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
  /*const { t } = useTranslation()
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

  /*return (
    <Container component="main" maxWidth="xs">
      <NavBar/>
      <CssBaseline />
      <Typography component="h1" variant="h5" align="center" sx={{ marginTop: 2 }}>
        {t('app_name')}
      </Typography>

      {showInit ? 
       <Init changeView={handleLoginRegisterToggleView}/*  changeGoogleView={handleGoogleViewChange}  />*/
       /* : showGoogleLM ?
        <GoogleLoginMenu goBack={handleGoogleViewChange} /> */
          /*: showLogin ?
            <Login goBack={handleLoginRegisterToggleView} /> 
            : <AddUser goBack={handleLoginRegisterToggleView} />}
    </Container>
    /* changed the login button to /components/Init.tsx (where the other buttons are)*/
  /*);*/
}

export default App;
