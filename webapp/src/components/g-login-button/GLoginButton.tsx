import { GoogleLogin } from '@react-oauth/google';
import './g-login-button.scss';
import { useTranslation } from 'react-i18next';

const GLoginButton = () => 
{
    const { t } = useTranslation();

    return(
      <GoogleLogin
         onSuccess={(credentialResponse) => 
            {
                console.log(credentialResponse);
            }}
         onError={() => 
            {
                console.log(t('g_login_button_login_failed'));
            }}
    />)
}

export default GLoginButton;