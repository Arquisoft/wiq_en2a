import { useTranslation } from 'react-i18next';
import {Button, Stack} from "@mui/material";
import GLoginButton from '../g-login-button/GLoginButton';
import './Init.scss';

type ActionProps = {
    changeView:(arg:boolean)=> void;
    /* changeGoogleView:()=> void; */
}

const Init = (props:ActionProps) =>{
  const { t } = useTranslation()
    return (
      <Stack direction="column">
          <Button onClick={() => props.changeView(false)}>
            {t('register')}
          </Button>
          <Button onClick={() => props.changeView(true)}>
            {t('login')}
          </Button>
          <GLoginButton /* Añadido sin usar typescript ya que no da problemas con el componente de google auth *//>
      </Stack>
    );
};

export default Init;