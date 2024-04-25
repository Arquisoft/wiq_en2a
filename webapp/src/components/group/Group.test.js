import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import { render, screen, fireEvent } from '@testing-library/react';
import { GroupTable } from './GroupTable';

const mock = new MockAdapter(axios);

describe('GroupTable component', () => {
  beforeEach(() => {
    mock.reset();
  });

  it('renders group information', async () => {
    const groupUUID = '123'; // Replace with your group UUID
    const groupName = 'Test Group';
    const totalPoints = 100;
    const numberMembers = 5;
    const adminUser={ username: 'User3', totalScore: 20, role: 'Leader',uuid:'789' };
    const members = [
      { username: 'User1', totalScore: 50, role: 'Member',uuid:'123' },
      { username: 'User2', totalScore: 30, role: 'Member' ,uuid:'456'},
      adminUser,
      // Add more members as needed
    ];

    // Mock the Axios request
    mock.onGet(`${process.env.REACT_APP_API_ENDPOINT}/getGroup/${groupUUID}`).reply(200, {
      groupName,
      members,
      admin:{adminUser}
    });

    // Render the component
    render(<GroupTable groupUUID={groupUUID} nowHasNoGroup={() => {}} />);

    

    // Assert that each member is rendered
    for (const member of members) {
      expect(await screen.findByText(member.username)).toBeInTheDocument();
      expect(screen.getByText(member.role)).toBeInTheDocument();
      expect(screen.getByText(member.totalScore)).toBeInTheDocument();
    }
  });

});
