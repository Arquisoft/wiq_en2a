import { FC } from 'react'
import { SocketProps } from './GameMultiPlayer';
import './MenuMultiplayer.css'

interface MenuMultiplayerProps {
  socket: SocketProps;
  handleCurrentStage: (n: number) => void
}

const MenuMultiplayer: FC<MenuMultiplayerProps> = ({socket, handleCurrentStage}) => {

    const createParty = () => {
        handleCurrentStage(2);
        socket.emit('createParty');
    };

    return (
        <div className="container">
      <button onClick={createParty} className="create-party-button">
        Create Party
      </button>
      <div className="join-party-container">
        <input className="join-party-input" placeholder="Code"></input>
        <button className="join-party-button">Join Party</button>
      </div>
    </div>
    )
}

export default MenuMultiplayer