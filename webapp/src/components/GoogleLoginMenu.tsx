
/* import { Container} from '@mui/material';
import { useTranslation } from 'react-i18next';
import GLoginButton from './GLoginButton';


type ActionProps = {
    goBack:()=> void;
}

const GoogleLogin = (props: ActionProps) => {

    const { t } = useTranslation();


    return(
        <Container component="main" maxWidth="xs" sx={{ marginTop: 4 }}>

        
        <p>{t("login_google")}</p>
        

        <div>
       <GLoginButton/>
        <button color="primary" onClick={props.goBack}>
            {t('go_back')}
        </button>
        </div>


        </Container>

    )


}

export default GoogleLogin; */