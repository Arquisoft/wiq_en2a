import GoogleLogin from "react-google-login";

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
                buttonText="Login with Google"
                onSuccess={onSuccess}
                onFailure={onFailure}
                cookiePolicy={'single_host_origin'}
            />
        </div>
    )
}

export default GLoginButton;