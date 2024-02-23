

type ActionProps = {
    changeView:(arg:boolean)=> void;
}

const Init = (props:ActionProps) =>{
    return (
        <div>
          <button className={'app-button'}  
          onClick={() => props.changeView(false)}>
            Register
          </button>
          <button className={'app-button'} 
          onClick={() => props.changeView(true)}>
            Login
          </button>
        </div> 
    );
};

export default Init;