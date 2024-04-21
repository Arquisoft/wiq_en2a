import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import NavBar from './NavBar';

describe('NavBar Component', () => {
  it('should render without crashing', () => {
    const { getByText } = render(<NavBar />);
    const appName = getByText('app_name'); // Reemplaza 'app_name' con el texto real del nombre de la aplicación
    expect(appName).toBeInTheDocument();
  });

  it('should navigate to "/game" when "Game" button is clicked', () => {
    const { getByText } = render(<NavBar />);
    const gameButton = getByText('nav_game'); // Reemplaza 'nav_game' con el botón de juego
    fireEvent.click(gameButton);
    expect(window.location.pathname).toBe('/game');
  });

  it('should navigate to "/groups" when "Groups" button is clicked', () => {
    const { getByText } = render(<NavBar />);
    const gameButton = getByText('nav_groups'); // Reemplaza 'nav_groups' con el botón de grupos
    fireEvent.click(gameButton);
    expect(window.location.pathname).toBe('/groups');
  });

    it('should navigate to "/scoreboard" when "Scoreboard" button is clicked', () => {
    const { getByText } = render(<NavBar />);
    const gameButton = getByText('nav_scoreboard'); // Reemplaza 'nav_scoreboard' con el botón de marcador
    fireEvent.click(gameButton);
    expect(window.location.pathname).toBe('/scoreboard');
    });

  // Agrega más pruebas similares para los otros botones y funcionalidades del componente NavBar
});