import React from 'react';
import { render } from '@testing-library/react';
import Scoreboard from './Scoreboard';

describe('Scoreboard Component', () => {
  it('should render scoreboard component', () => {
    const { getByText } = render(<Scoreboard />);
    const headingElement = getByText('Scoreboard');
    const paragraphElement = getByText('Here is the scoreboard');

    expect(headingElement).toBeInTheDocument();
    expect(paragraphElement).toBeInTheDocument();
  });
});