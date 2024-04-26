import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios'; // Mockear axios
import NoGroup from './NoGroup';

jest.mock('axios');

describe('NoGroup component', () => {
  beforeEach(() => {
    axios.get.mockResolvedValue({
      data: [
        {
          groupName: 'Group 1',
          maxNumUsers: '10',
          numMembers: '5',
          uuid: '1',
          isPublic: "true",
          members:[]
        },
        {
          groupName: 'Group 2',
          maxNumUsers: '20',
          numMembers: '15',
          uuid: '2',
          isPublic: "false",
          members:[]
        }
      ]
    });
  });

  test('renders the component properly', async () => {
    render(<NoGroup />);
    
    // Verifica que el contenedor del componente esté presente en el DOM
    expect(screen.getByTestId('no-group-container')).toBeInTheDocument();
    
    // Verifica que el botón "Join a group" esté presente en el DOM
    expect(screen.getByTestId('join-group-button')).toBeInTheDocument();

    // Verifica que el botón "Create a group" esté presente en el DOM
    expect(screen.getByTestId('create-group-button')).toBeInTheDocument();
  });

  test('clicking on "Join a group" button opens the join modal', async () => {
    render(<NoGroup />);
    
    // Simula hacer clic en el botón "Join a group"
    fireEvent.click(screen.getByTestId('join-group-button'));

    // Verifica que el modal de join group se muestre en el DOM
    await waitFor(() => {
      expect(screen.getByTestId('join-group-modal')).toBeInTheDocument();
    });
  });

 test('clicking on "Create a group" button opens the create modal', async () => {
    render(<NoGroup />);
    
    // Simula hacer clic en el botón "Create a group"
    fireEvent.click(screen.getByTestId('create-group-button'));

    // Verifica que el modal de create group se muestre en el DOM
    await waitFor(() => {
      expect(screen.getByTestId('create-group-modal')).toBeInTheDocument();
    });
  });
});
