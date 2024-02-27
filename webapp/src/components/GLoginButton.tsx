import GoogleLogin from "react-google-login";
import { useTranslation } from 'react-i18next';

const { t } = useTranslation();
const GClientId = "YOUR_GOOGLE";
const GLoginButton = () => {

    const onSuccess = (response: any) => {
        console.log(  "LOGIN SUCCESS! Current User: ",response.profileObject); 
         // handle successful login""
    };

    const onFailure = (error: any) => {
        console.log(  "LOGIN FAILED! Error: ",error); 
        // handle failed login
    };

    return (
        <div id='signInButton'>
            <GoogleLogin
                clientId={GClientId}
                buttonText={t('login_google')}
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}

export default GLoginButton;