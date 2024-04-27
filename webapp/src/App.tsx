import React from 'react';
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./Router";
import { useTranslation } from 'react-i18next';


/** The old code is not in /pages/init/index.tsx and is shown as default */
function App() {

  const { i18n } = useTranslation();

  React.useEffect(() => {
    localStorage.clear();
    localStorage.setItem("lang", navigator.language.slice(0, 2));
    i18n.changeLanguage(navigator.language.slice(0, 2));
  }, [i18n]);

  
  return (
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
  );
}

export default App;
