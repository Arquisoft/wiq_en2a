import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import GLoginButton from './GLoginButton';
import { GoogleOAuthProvider } from '@react-oauth/google';

describe('GLoginButton Component', () => {
  it('should render without crashing', () => {
    render(
      <GoogleOAuthProvider>
        <GLoginButton />
      </GoogleOAuthProvider>
    );
  });
 
});

