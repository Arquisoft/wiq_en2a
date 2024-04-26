import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect'; // For additional matchers like toBeInTheDocument
import { GoogleOAuthProvider } from '@react-oauth/google';
import Init from './Init';

// Mock the changeView function
const mockChangeView = jest.fn();

describe('Init Component', () => {
  it('should render without crashing', () => {
    const { getByTestId } = render(
        <GoogleOAuthProvider>
        <Init changeView={mockChangeView} />
        </GoogleOAuthProvider>
      
    );
    expect(getByTestId('register')).toBeInTheDocument(); // Use data-testid attribute as ID
    expect(getByTestId('login')).toBeInTheDocument(); // Use data-testid attribute as ID
  });

  it('should call changeView with false when "register" button is clicked', () => {
    const { getByTestId } = render(
      <GoogleOAuthProvider>
        <Init changeView={mockChangeView} />
        </GoogleOAuthProvider>
     
    );
    const registerButton = getByTestId('register'); // Use data-testid attribute as ID
    fireEvent.click(registerButton);
    expect(mockChangeView).toHaveBeenCalledWith(false);
  });

  it('should call changeView with true when "login" button is clicked', () => {
    const { getByTestId } = render(
        <GoogleOAuthProvider>
        <Init changeView={mockChangeView} />
        </GoogleOAuthProvider>
      
    );
    const loginButton = getByTestId('login'); // Use data-testid attribute as ID
    fireEvent.click(loginButton);
    expect(mockChangeView).toHaveBeenCalledWith(true);
  });
});
