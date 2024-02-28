import GoogleLogin from "react-google-login";
import { useTranslation } from 'react-i18next';


const GClientId = "http://259836370797-brpmuu6pn6a20eecpjag1l2nkoqp3eo6.apps.googleusercontent.com";
const GLoginButton = () => {
    const { t } = useTranslation();

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