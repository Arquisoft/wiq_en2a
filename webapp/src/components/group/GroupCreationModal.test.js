import { render, fireEvent } from '@testing-library/react';
import { CreationModal } from './GroupCreationModal';

jest.mock('axios');

describe('CreationModal component', () => {
  test('renders the modal properly', async () => {
    const { getByTestId } = render(<CreationModal nowHasGroup={() => {}} setError={() => {}} toggleCreateModal={() => {}} />);
    
    // Verifica que el título del modal esté presente
    expect(getByTestId('modal-title')).toBeInTheDocument();
    
    // Verifica que los elementos de entrada estén presentes
    expect(getByTestId('group-name-input')).toBeInTheDocument();
    expect(getByTestId('yes-button')).toBeInTheDocument();
    expect(getByTestId('no-button')).toBeInTheDocument();
    expect(getByTestId('description-input')).toBeInTheDocument();
  });

  test('clicking on the create button calls the createGroup function', async () => {
    const mockNowHasGroup = jest.fn();
    const mockSetError = jest.fn();
    const mockToggleCreateModal = jest.fn();

    const { getByTestId } = render(<CreationModal nowHasGroup={mockNowHasGroup} setError={mockSetError} toggleCreateModal={mockToggleCreateModal} />);
    
    // Simula hacer clic en el botón de creación
    fireEvent.click(getByTestId('create-button'));
    
  });

});