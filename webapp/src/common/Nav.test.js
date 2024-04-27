import React from 'react';
import { render, fireEvent, getByTestId } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom'; // Importa MemoryRouter
import NavBar from './Nav';

describe('NavBar Component', () => {
  it('should render without crashing', () => {
    const { getByTestId } = render(
      <MemoryRouter> {/* Envuelve el componente en MemoryRouter */}
        <NavBar />
      </MemoryRouter>
    );
    const appName = getByTestId('app_name'); // Reemplaza 'app_name' con el texto real del nombre de la aplicación
    expect(appName).toBeInTheDocument();
  });
/** 
  it('should navigate to "/game" when "Game" button is clicked', () => {
    const { getByTestId } = render(
      <MemoryRouter> 
        <NavBar />
      </MemoryRouter>
    );
    const gameButton = getByTestId('nav_game'); // Reemplaza 'nav_game' con el botón de juego
    fireEvent.click(gameButton);
    expect(window.location.pathname).toBe('/game');
  });

  it('should navigate to "/groups" when "Groups" button is clicked', () => {
    const { getByTestId } = render(
      <MemoryRouter> 
        <NavBar />
      </MemoryRouter>
    );
    const groupsButton = getByTestId('nav_groups'); // Reemplaza 'nav_groups' con el botón de grupos
    fireEvent.click(groupsButton);
    expect(window.location.pathname).toBe('/groups');
  });

  it('should navigate to "/scoreboard" when "Scoreboard" button is clicked', () => {
    const { getByTestId: getByTestId } = render(
      <MemoryRouter> 
        <NavBar />
      </MemoryRouter>
    );
    const scoreboardButton = getByTestId('nav_scoreboard'); // Reemplaza 'nav_scoreboard' con el botón de marcador
    fireEvent.click(scoreboardButton);
    expect(window.location.pathname).toBe('/scoreboard');
  });
**/
  // Agrega más pruebas similares para los otros botones y funcionalidades del componente NavBar
});