import React from 'react';
import { render } from '@testing-library/react';
import { GroupsPage } from './index';

describe('GroupsPage component', () => {
  it('renders without crashing', () => {
    render(<GroupsPage />);
  });
});