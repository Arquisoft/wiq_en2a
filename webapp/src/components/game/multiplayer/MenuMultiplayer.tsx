import { FC } from 'react'
import { SocketProps } from './GameMultiPlayer';

interface MenuMultiplayerProps {
  socket: SocketProps;
  handleCurrentStage: (n: number) => void
}

const MenuMultiplayer: FC<MenuMultiplayerProps> = ({socket, handleCurrentStage}) => {

    const createParty = () => {
        socket.emit('createParty');
      };
  return (
    <div>
    <h1>Multiplayer Game</h1>
      <button onClick={createParty}>Create Party</button>
      <label>Join party</label>
      <input placeholder='Code'></input>
  </div>)
}

export default MenuMultiplayer