import GoogleLogin from "react-google-login";
import { useTranslation } from 'react-i18next';


const GClientId = "http://259836370797-brpmuu6pn6a20eecpjag1l2nkoqp3eo6.apps.googleusercontent.com";
const GLoginButton = () => {
    const { t } = useTranslation();

    const onSuccess = (response: any) => {
        console.log(  "LOGIN SUCCESS! Current User: ",response.profileObject); 
         // handle successful login""
         var authResponse = response.getAuthResponse();
         var accessToken = authResponse.access_token;

         //Validations in backend should be done
        
         // Obtener el perfil del usuario
          var profile = accessToken.getBasicProfile();
    
         // Obtener el email del usuario
         var email = profile.getEmail();
         console.log(email);
         //send email to backend
         
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
                isSignedIn={true}
            />
        </div>
        
    )
}

export default GLoginButton;