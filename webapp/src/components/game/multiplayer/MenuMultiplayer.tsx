import { FC, useState } from 'react'
import { SocketProps } from './GameMultiPlayer';
import './MenuMultiplayer.css'

interface MenuMultiplayerProps {
  socket: SocketProps;
  handleCurrentStage: (n: number) => void
}

const MenuMultiplayer: FC<MenuMultiplayerProps> = ({socket, handleCurrentStage}) => {

    const username = localStorage.getItem('username');
    const [typedCode, setTypedCode] = useState<string>();

    const createParty = () => {
        handleCurrentStage(2);
        socket.emit('createParty', username);
    };

    const joinParty = () => {
      console.log("Joining party...")
      console.log(typedCode)
      console.log(username)
      handleCurrentStage(2);
      socket.emit('joinParty', typedCode, username);
    }

    return (
        <div className="container">
      <button onClick={createParty} className="create-party-button">
        Create Party
      </button>
      <div className="join-party-container">
        <input className="join-party-input" placeholder="Code" onChange={(e) => setTypedCode(e.target.value)}></input>
        <button className="join-party-button" onClick={joinParty}>Join Party</button>
      </div>
    </div>
    )
}

export default MenuMultiplayer