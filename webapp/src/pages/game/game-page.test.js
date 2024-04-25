import React from 'react';
import { render } from '@testing-library/react';
import { GamePage } from './index';
import { BrowserRouter as Router } from 'react-router-dom'; // Importa BrowserRouter

describe('GamePage component', () => {
  it('renders without crashing', () => {
    render(
        <Router>
            <GamePage />
        </Router>
    );
  });
});
