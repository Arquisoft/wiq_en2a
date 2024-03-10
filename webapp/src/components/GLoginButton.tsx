
import { GoogleLogin } from '@react-oauth/google';

const GLoginButton = () => {

    return(
      <GoogleLogin
         onSuccess={(credentialResponse) => {
                console.log(credentialResponse);
            }}
         onError={() => {
                console.log('Login Failed');
            }}
    />)
}

export default GLoginButton;