import React from 'react';
import { render, fireEvent, getByTestId } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom'; // Importa MemoryRouter
import NavBar from './Nav';

describe('NavBar Component', () => {
  it('should render without crashing', () => {
    const { getByTestId } = render(
      <BrowserRouter> {/* Envuelve el componente en MemoryRouter */}
        <NavBar />
      </BrowserRouter>
    );
    const appName = getByTestId('app_name'); // Reemplaza 'app_name' con el texto real del nombre de la aplicación
    expect(appName).toBeInTheDocument();
  });
  it('should navigate to "/game" when "Game" button is clicked', () => {
    const { getByTestId } = render(
      <BrowserRouter> 
        <NavBar />
      </BrowserRouter>
    );
    const gameButton = getByTestId('nav_game'); // Reemplaza 'nav_game' con el botón de juego
    fireEvent.click(gameButton);
    expect(window.location.pathname).toBe('/game');
  });

  it('should navigate to "/groups" when "Groups" button is clicked', () => {
    const { getByTestId } = render(
      <BrowserRouter> 
        <NavBar />
      </BrowserRouter>
    );
    const groupsButton = getByTestId('nav_groups'); // Reemplaza 'nav_groups' con el botón de grupos
    fireEvent.click(groupsButton);
    console.log(window.location.pathname)
    expect(window.location.pathname).toBe('/groups');
  });

  // Agrega más pruebas similares para los otros botones y funcionalidades del componente NavBar
});