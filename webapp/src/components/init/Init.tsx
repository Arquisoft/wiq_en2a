import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {Button, Stack} from "@mui/material";
import GLoginButton from '../g-login-button/GLoginButton';
import './init.scss';

type ActionProps = {
    changeView:(arg:boolean)=> void;
}

const Init = (props:ActionProps) =>{
  const { t } = useTranslation()
  const [, setCurrentView] = useState<'register' | 'login'>('register');

  const handleViewChange = (isLoginView: boolean) => {
    setCurrentView(isLoginView ? 'login' : 'register');
    props.changeView(isLoginView);
    document.title = isLoginView ? t('Conocer y Vencer - Login') : t('Conocer y Vencer - Register');
  };

  return (
    <Stack direction="column">
      <Button onClick={() => handleViewChange(false)} size='large'>
        {t('register')}
      </Button>
      <Button onClick={() => handleViewChange(true)} size='large' sx={{ marginBottom: 2 }}>
        {t('login')}
      </Button>
      <GLoginButton />
    </Stack>
  );
};

export default Init;