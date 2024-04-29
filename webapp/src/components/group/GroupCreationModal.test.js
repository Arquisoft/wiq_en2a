import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import { CreationModal } from './GroupCreationModal';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mockAxios = new MockAdapter(axios);

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

  it('should render input fields and handle changes correctly', async () => {
    const nowHasGroupMock = jest.fn();
    const setErrorMock = jest.fn();
    const toggleCreateModalMock = jest.fn();

     render(
      <CreationModal
        nowHasGroup={nowHasGroupMock}
        setError={setErrorMock}
        toggleCreateModal={toggleCreateModalMock}
      />
    );

    const groupName = screen.getByTestId('group-name-input');
    const description = screen.getByTestId('description-input');

    // Simulate changing input values
    await userEvent.type(groupName, "a")
    await userEvent.type(description, "a")
    fireEvent.click(screen.getByTestId('no-button'));
    fireEvent.change(screen.getByTestId('max-members-input'), { target: { value: '5' } });

    // Ensure input values are updated correctly
    expect(screen.getByTestId('max-members-input')).toHaveValue(5);

    mockAxios.onPost('http://localhost:8000/createGroup').reply(200, {group: "1"});


    fireEvent.click(screen.getByTestId('create-button'));
    await waitFor(() => {
      expect(nowHasGroupMock).toHaveBeenCalled();
    });
  });

});