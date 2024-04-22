import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import { GroupTable } from './GroupTable';

jest.mock('axios');

describe('GroupTable component', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders group information when members are charged', async () => {
    const mockedMembers = [
      { username: 'user1', totalScore: '100', role: 'Member' },
      { username: 'user2', totalScore: '150', role: 'Leader' },
    ];
    const mockedGroup = {
      members: mockedMembers,
      admin: { uuid: 'adminUUID' },
      groupName: 'Test Group',
    };
    axios.get.mockResolvedValueOnce({ data: mockedGroup });
    
    render(<GroupTable groupUUID="testUUID" nowHasNoGroup={() => {}} />);
    console.log('GroupTable component rendered');
    debugger;
    
    await waitFor(() => {
        
      expect(screen.getByTestId('group-name')).toBeInTheDocument();
      expect(screen.getByTestId('total-points')).toBeInTheDocument();
      expect(screen.getByTestId('number-members')).toBeInTheDocument();
    });

    for (const member of mockedMembers) {
      expect(screen.getByText(member.username)).toBeInTheDocument();
      expect(screen.getByText(member.role)).toBeInTheDocument();
      expect(screen.getByText(member.totalScore)).toBeInTheDocument();
    }
  });

  it('calls nowHasNoGroup when leave button is clicked', async () => {
    const mockedMembers = [
      { username: 'user1', totalScore: '100', role: 'Member' },
      { username: 'user2', totalScore: '150', role: 'Leader' },
    ];
    const mockedGroup = {
      members: mockedMembers,
      admin: { uuid: 'adminUUID' },
      groupName: 'Test Group',
    };
    axios.get.mockResolvedValueOnce({ data: mockedGroup });
    axios.post.mockResolvedValueOnce({});

    const nowHasNoGroupMock = jest.fn();
    
    render(<GroupTable groupUUID="testUUID" nowHasNoGroup={nowHasNoGroupMock} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('leave-button')).toBeInTheDocument();
    });

    userEvent.click(screen.getByTestId('leave-button'));

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining('/leaveGroup'),
      expect.objectContaining({ expelledUUID: expect.any(String), groupName: 'Test Group', adminUUID: 'adminUUID' })
    );
    
    await waitFor(() => {
      expect(nowHasNoGroupMock).toHaveBeenCalled();
    });
  });
});
