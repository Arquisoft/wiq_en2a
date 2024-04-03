import { FC, useState } from 'react'
import { SocketProps, UserPlayer } from './GameMultiPlayer';
import './MenuMultiplayer.css'

interface MenuMultiplayerProps {
  socket: SocketProps;
  handleCurrentStage: (n: number) => void
  handlePartyCode: (n: string) => void
}

const MenuMultiplayer: FC<MenuMultiplayerProps> = ({socket, handleCurrentStage, handlePartyCode}) => {

    const username = localStorage.getItem('username');
    const totalPoints = localStorage.getItem('score');
    const uuid = localStorage.getItem('uuid');
    const [typedCode, setTypedCode] = useState<string>();

    const createParty = () => {
      handleCurrentStage(2);
      const user: UserPlayer = {
          username: username,
          totalPoints: parseInt(totalPoints),
          uuid: uuid,
          isAdmin: true
      }
      socket.emit('createParty', user);
    };

    const joinParty = () => {
      const user: UserPlayer = {
        username: username,
        totalPoints: parseInt(totalPoints),
        uuid: uuid,
        isAdmin: false
      }
      handlePartyCode(typedCode)
      socket.emit('joinParty', typedCode, user);
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