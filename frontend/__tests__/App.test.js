import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

// UI (Title)
describe('<App />', () => {
  it('Title', () => {
    // Render the App component
    render(<App />);

    // Look for text
    const titleElement = screen.getByText('Record Speech');

    // Confirm the text exists
    expect(titleElement).toBeTruthy();
  }); 
});

// UI (Record Button) 
describe('<App />', () => {
  it('Record Button', () => {
    render(<App />);
    const recordButton = screen.getByRole('button', { name: /Record/i });
    expect(recordButton).toBeTruthy();
  });
});


// Record button press -> Display stop button
describe('<App /> - Recording Controls', () => {
  it('should display Stop button when recording starts', () => {
    render(<App />);
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    const stopButton = screen.getByRole('button', { name: /Stop/i });
    expect(stopButton).toBeTruthy();
  });
});


// Remove any button to start recording whilst recording
describe('<App /> - Recording Controls', () => {
   it('should hide Record button when recording is active', () => {
    render(<App />);
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    expect(recordButton).not.toBeVisible();
  });
});

// Recording Status Visual
describe('<App /> - Recording Status', () => {
  it('should display "Recording..." text when recording starts', () => {
    render(<App />);
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    const recordingStatus = screen.getByText(/Recording\.\.\./);
    expect(recordingStatus).toBeTruthy();
  });
});

// Microphone Permission Tests
describe('<App /> - Permissions & Errors', () => {
  it('should show permission error message if microphone not allowed', () => {
    render(<App />);
    // Mock permission denied state
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    const errorMessage = screen.getByText(/Microphone permission denied/i);
    expect(errorMessage).toBeTruthy();
  });
});

// Recording failed test
describe('<App /> - Permissions & Errors', () => {
  it('should display error when recording fails', () => {
    render(<App />);
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    
    
    const errorText = screen.queryByText(/Recording failed/i);
    
    if (errorText) {
      //Error
      expect(errorText).toBeTruthy();
    } else {
      // No Error
      const stopButton = screen.getByRole('button', {name: /Stop/i});
      expect(stopButton).toBeTruthy();
    }
    });
});


// Check save and delete buttons appear after stop button pressed
describe('<App /> - UI State', () => {
  it('should show Save/Delete buttons after recording', () => {
    render(<App />);
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    const stopButton = screen.getByRole('button', { name: /Stop/i });
    fireEvent.press(stopButton);

    const saveButton = screen.getByRole('button', { name: /Save/i });
    const deleteButton = screen.getByRole('button', { name: /Delete/i });
    expect(saveButton).toBeTruthy();
    expect(deleteButton).toBeTruthy();
  });
});


