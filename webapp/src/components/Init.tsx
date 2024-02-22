import React from 'react'

type ActionProps = {
    changeView:(boolean)=> void;
}

const Init = (props:ActionProps) =>{
    return (
        <div>
          <button className={'app-button'}  
          onClick={(event: React.MouseEvent<HTMLElement>) => props.changeView(false)}>
            Register
          </button>
          <button className={'app-button'} 
          onClick={(event: React.MouseEvent<HTMLElement>) => props.changeView(true)}>
            Login
          </button>
        </div> 
    );
};

export default Init;