import { useTranslation } from 'react-i18next';
import {Button, Stack} from "@mui/material";
import GLoginButton from '../g-login-button/GLoginButton';
import './Init.scss';

type ActionProps = {
    changeView:(arg:boolean)=> void;
}

const Init = (props:ActionProps) =>{
  const { t } = useTranslation()
    return (
      <Stack direction="column">
          <Button onClick={() => props.changeView(false)} size='large'>
            {t('register')}
          </Button>
          <Button onClick={() => props.changeView(true)} size='large' sx={{ marginBottom: 2 }}>
            {t('login')}
          </Button>
          <GLoginButton />
      </Stack>
    );
};

export default Init;