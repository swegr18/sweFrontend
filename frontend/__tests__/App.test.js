import React from 'react';
import { render, screen } from '@testing-library/react-native';
import App from '../App';

describe('<App />', () => {
  it('Record Instruction', () => {
    // Render the App component
    render(<App />);

    // Look for text
    const titleElement = screen.getByText('Record');

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


describe('<App /> - Recording Controls', () => {
  it('should display Stop button when recording starts', () => {
    render(<App />);
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    const stopButton = screen.getByRole('button', { name: /Stop/i });
    expect(stopButton).toBeTruthy();
  });
});

describe('<App /> - Recording Controls', () => {
    it('should display Pause button during recording', () => {
    render(<App />);
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    const pauseButton = screen.getByRole('button', { name: /Pause/i });
    expect(pauseButton).toBeTruthy();
  });
});

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

describe('<App /> - Permissions & Errors', () => {
  it('should display error when recording fails', () => {
    render(<App />);
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    const errorText = screen.getByText(/Recording failed/i);
    expect(errorText).toBeTruthy();
  });
});



// Test Suite for UI - Record Buttons, Save Buttons, Delete Buttons 
describe('<App /> - UI State', () => {
  it('should disable Record button while recording', () => {
    render(<App />);
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    expect(recordButton).toBeDisabled();
  });
});

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

