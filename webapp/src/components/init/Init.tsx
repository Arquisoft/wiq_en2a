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
    document.title = isLoginView ? (t('app_name') + '-' + t('login')) : (t('app_name') + '-' + t('register'));
  };

  return (
    <Stack direction="column">
      <Button  onClick={() => handleViewChange(false)} size='large' data-testid="register">
        {t('register')}
      </Button>
      <Button  onClick={() => handleViewChange(true)} size='large' data-testid="login" sx={{ marginBottom: 2 }}>
        {t('login')}
      </Button>
      <GLoginButton />
    </Stack>
  );
};

export default Init;