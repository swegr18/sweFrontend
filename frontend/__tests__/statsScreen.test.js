import React from 'react';
import { render, screen, fireEvent, waitFor, act} from '@testing-library/react-native';
import App from '../App';

describe('<App /> - Stats Pop-up', () => {
  it('should show Stats pop-up when the Stats button pressed', async () => {
    render(<App />);
    const statsButton = screen.getByRole('button', { name: /statsButton/i });
    fireEvent.press(statsButton);

    await waitFor(() =>{
      expect(screen.queryByText('Stats')).toBeTruthy();
      expect(screen.queryByRole('button', {name: /statsBackButton/i})).toBeTruthy();
      expect(screen.queryByRole('button', { name: /statsButton/i })).toBeNull();
    });
  });
});

describe('<App /> - Stats Pop-up', () => {
  it('should close Stats pop-up when the Close button pressed', async () => {
    render(<App />);
    const statsButton = screen.getByRole('button', { name: /statsButton/i });
    fireEvent.press(statsButton);

    const backButton = await screen.findByRole('button',{name: /statsBackButton/i})
    fireEvent.press(backButton);

    await waitFor(() =>{
      expect(screen.queryByText('Stats')).toBeNull();
      expect(screen.queryByRole('button', {name: /statsBackButton/i})).toBeNull();
      expect(screen.queryByRole('button', { name: /statsButton/i })).toBeTruthy();
    });
  });
});