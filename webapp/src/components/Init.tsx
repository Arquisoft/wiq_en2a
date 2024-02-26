import { useTranslation } from 'react-i18next';

type ActionProps = {
    changeView:(arg:boolean)=> void;
}

const Init = (props:ActionProps) =>{
  const { t } = useTranslation()
    return (
        <div>
          <button className={'app-button'}  
          onClick={() => props.changeView(false)}>
            {t('register')}
          </button>
          <button className={'app-button'} 
          onClick={() => props.changeView(true)}>
            {t('login')}
          </button>
        </div> 
    );
};

export default Init;