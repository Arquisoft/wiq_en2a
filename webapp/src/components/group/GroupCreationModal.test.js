import { render, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios'; // Mockear axios
import { CreationModal } from './GroupCreationModal';

jest.mock('axios');

describe('CreationModal component', () => {
  test('renders the modal properly', async () => {
    const { getByText, getByLabelText } = render(<CreationModal nowHasGroup={() => {}} setError={() => {}} toggleCreateModal={() => {}} />);
    
    // Verifica que el título del modal esté presente
    expect(getByText('Create group')).toBeInTheDocument();
    
    // Verifica que los elementos de entrada estén presentes
    expect(getByLabelText('Group name')).toBeInTheDocument();
    expect(getByText('Yes')).toBeInTheDocument();
    expect(getByText('No')).toBeInTheDocument();
    expect(getByLabelText('Description')).toBeInTheDocument();
  });

  test('clicking on the create button calls the createGroup function', async () => {
    const mockNowHasGroup = jest.fn();
    const mockSetError = jest.fn();
    const mockToggleCreateModal = jest.fn();

    const { getByText } = render(<CreationModal nowHasGroup={mockNowHasGroup} setError={mockSetError} toggleCreateModal={mockToggleCreateModal} />);
    
    // Simula hacer clic en el botón de creación
    fireEvent.click(getByText('Create group'));

    
  });

  test('changing the group name updates the state', async () => {
    const { getByLabelText } = render(<CreationModal nowHasGroup={() => {}} setError={() => {}} toggleCreateModal={() => {}} />);
    
    // Simula cambiar el valor del nombre del grupo
    fireEvent.change(getByLabelText('Group name'), { target: { value: 'New Group' } });

    // Verifica que el valor del nombre del grupo haya sido actualizado
    expect(getByLabelText('Group name')).toHaveValue('New Group');
  });

  // Agrega más tests según sea necesario para cubrir otras funcionalidades y casos de uso.
});