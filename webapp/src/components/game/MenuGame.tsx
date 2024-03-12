import { Button } from '@mui/material'
import { FC } from 'react'

interface MenuGameProps {
    setCurrentStage: (n: number) => void;
}

const MenuGame: FC<MenuGameProps> = ({setCurrentStage}) => {
  return (
    <>
        <Button onClick={() => setCurrentStage(2)}>Single-player</Button>
        <Button disabled>Multi-player (soon)</Button>
    </>
  )
}

export default MenuGame