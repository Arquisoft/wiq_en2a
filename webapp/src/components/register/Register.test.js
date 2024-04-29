import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { BrowserRouter as Router } from 'react-router-dom'; // Import Router
import Register from './Register';

const mockAxios = new MockAdapter(axios);

describe('Register component', () => {
  
  beforeEach(() => {
    mockAxios.reset();
  });

  it('should add user successfully', async () => {
    var localStorageMock = (function() {
      var store = {};
      return {
        getItem: function(key) {
          return store[key];
        },
        setItem: function(key, value) {
          store[key] = value.toString();
        },
        clear: function() {
          store = {};
        },
        removeItem: function(key) {
          delete store[key];
        }
      };
    })();
    Object.defineProperty(window, 'localStorage', { value: localStorageMock });
    render(
      <Router> 
        <Register />
      </Router>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const addUserButton = screen.getByRole('button', { name: /register/i });

    // Mock the axios.post request to simulate a successful response
    mockAxios.onPost('http://localhost:8000/adduser').reply(200);
    mockAxios.onPost('http://localhost:8000/login').reply(200, {
      username: 'testUser',
      totalScore: 0,
      nWins: 0,
      uuid: '123'
    });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the Snackbar to be open
    await waitFor(() => {
      expect(screen.getByTestId('register-successfull-snackbar')).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(localStorageMock.getItem('username')).toBe('testUser');
      expect(localStorageMock.getItem('score')).toBe('0');
      expect(localStorageMock.getItem('isAuthenticated')).toBe('true');
      expect(localStorageMock.getItem('userUUID')).toBe('123');
      
    });
  });

  it('should handle error when adding user', async () => {
    render(
      <Router> {/* Wrap Register component in Router */}
        <Register />
      </Router>
    );

    const usernameInput = screen.getByLabelText(/Username/i);
    const passwordInput = screen.getByLabelText(/Password/i);
    const addUserButton = screen.getByRole('button', { name: /register/i });

    // Mock the axios.post request to simulate an error response
    mockAxios.onPost('http://localhost:8000/adduser').reply(500, { error: 'Internal Server Error' });

    // Simulate user input
    fireEvent.change(usernameInput, { target: { value: 'testUser' } });
    fireEvent.change(passwordInput, { target: { value: 'testPassword' } });

    // Trigger the add user button click
    fireEvent.click(addUserButton);

    // Wait for the error Snackbar to be open
    await waitFor(() => {
      expect(screen.getByTestId('register-error-snackbar')).toBeInTheDocument();
    });
  });

  it('should handle return button click', () => {
    const goBackMock = jest.fn();
    const { getByTestId } = render(
      <Router> 
        <Register goBack={goBackMock}/>
      </Router>);

    // Click on the return button
    fireEvent.click(getByTestId("return-button"));

    expect(goBackMock).toHaveBeenCalled();
  });

});
