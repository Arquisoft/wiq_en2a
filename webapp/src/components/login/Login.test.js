import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Login from './Login';
import { MemoryRouter } from 'react-router-dom';

const mockAxios = new MockAdapter(axios);

describe('Login component', () => {
  
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should login user successfully', async () => {
    render(
      <MemoryRouter>
        <Login goBack={() => {}} />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/login').reply(200, {
      username: 'testUser',
      totalScore: 100,
      nWins: 5,
      uuid: '123456789'
    });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the login button click
    fireEvent.click(loginButton);

    // Wait for the Snackbar to be open
    await waitFor(() => {
      expect(screen.getByTestId("login-successfull-snackbar")).toBeInTheDocument();
    });

    // Verify local storage is set correctly
    expect(localStorage.getItem('username')).toBe('testUser');
    expect(localStorage.getItem('score')).toBe('100');
    expect(localStorage.getItem('nWins')).toBe('5');
    expect(localStorage.getItem('uuid')).toBe('123456789');
    expect(localStorage.getItem('isAuthenticated')).toBe('true');
    expect(localStorage.getItem('userUUID')).toBe('123456789');
    expect(localStorage.getItem('lang')).toBe('en');
  });

  it('should handle error when logging in user', async () => {
    render(
      <MemoryRouter>
        <Login goBack={() => {}} />
      </MemoryRouter>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const loginButton = screen.getByRole('button', { name: /login/i });

    // Mock the axios.post request to simulate an error response
    mockAxios.onPost('http://localhost:8000/login').reply(500, { error: 'Internal Server Error' });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the login button click
    fireEvent.click(loginButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByTestId('login-error-snackbar')).toBeInTheDocument();
    });

    // Verify local storage is not set when there's an error
    expect(localStorage.getItem('username')).toBeNull();
    expect(localStorage.getItem('score')).toBeNull();
    expect(localStorage.getItem('nWins')).toBeNull();
    expect(localStorage.getItem('uuid')).toBeNull();
    expect(localStorage.getItem('isAuthenticated')).toBeNull();
    expect(localStorage.getItem('userUUID')).toBeNull();
    expect(localStorage.getItem('lang')).toBeNull();
  });
});