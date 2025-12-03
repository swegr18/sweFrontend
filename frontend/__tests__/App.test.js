import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

describe('<App />', () => {
  it('Page Title', () => {
    // Render the App component
    render(<App />);

    // Look for text
    const titleElement = screen.getByText('Welcome to My App');

    // Confirm the text exists
    expect(titleElement).toBeTruthy();
  }); 
});


describe('<App />', () => {
  it('Record Button', () => {
    // Render the App component
    render(<App />);

    // Look for the Record button
    const recordButton = screen.getByRole('button', { name: /Record/i });

    // Confirm the button exists
    expect(recordButton).toBeTruthy();
  });
});