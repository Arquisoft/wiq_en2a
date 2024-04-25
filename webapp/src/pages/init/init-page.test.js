import { render, screen, fireEvent } from '@testing-library/react';
import { InitPage } from './index';
import { GoogleOAuthProvider } from '@react-oauth/google';

describe('InitPage', () => {
  test('renders the component', () => {
    render(
        <GoogleOAuthProvider>
            <InitPage />
        </GoogleOAuthProvider>
    
    );
    // Assert that the component renders without throwing an error
    expect(screen.getByTestId('init')).toBeInTheDocument();
  });
});