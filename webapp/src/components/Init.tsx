import { useTranslation } from 'react-i18next';

type ActionProps = {
    changeView:(arg:boolean)=> void;
    /* changeGoogleView:()=> void; */
}

const Init = (props:ActionProps) =>{
  const { t } = useTranslation()
    return (
        <div>
          <button className={'app-button'} id='registerButton'
          onClick={() => props.changeView(false)}>
            {t('register')}
          </button>
          <button className={'app-button'} id='loginButton'
          onClick={() => props.changeView(true)}>
            {t('login')}
          </button>
          {/* <button className={'app-button'}
          onClick={props.changeGoogleView}>
            {t('login_google')}
          </button> */}
        </div> 
    );
};

export default Init;