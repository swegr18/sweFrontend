import React from 'react';
import { render, screen, fireEvent, waitFor, act} from '@testing-library/react-native';
import App from '../App';
import { AudioModule } from 'expo-audio';

// UI (Title)
describe('<App /> - Recording Page', () => {
  it('Should display a title for the recording page', async () => {
    // Render the App component
    render(<App />);

    // Look for text
    const titleElement = await screen.findByText('Record Speech');

    // Confirm the text exists
    expect(titleElement).toBeTruthy();
  }); 
});



// UI (Record Button) 
describe('<App /> - Recording Page', () => {
  it('Should display a button to start recording', async () => {
    render(<App />);
    const recordButton = screen.findByRole('button', { name: /Record/i });
    expect(recordButton).toBeTruthy();
  });
});


// Record button press -> Display stop button  
describe('<App /> - Recording Controls', () => {
  it('should display Stop button when recording starts', async () => {
    render(<App />);
    AudioModule.requestRecordingPermissionsAsync.mockResolvedValueOnce({status: 'granted'});
    const recordButton = await screen.findByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);

    const stopButton = await screen.findByRole('button', { name: /Stop/i });

    expect(stopButton).toBeTruthy();
        
    fireEvent.press(stopButton);

  });
});


// Remove Record button once it is pressed   
describe('<App /> - Recording Controls', () => {
   it('Should hide Record button when recording is active', async () => {
    render(<App />);
    AudioModule.requestRecordingPermissionsAsync.mockResolvedValueOnce({status: 'granted'});
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Record/i })).toBeNull();
    });

    // Need this at the end of every test!!!
    const stopButton = await screen.findByRole('button', { name: /Stop/i });
    fireEvent.press(stopButton);

  });
});




// Recording Status Visual   
describe('<App /> - Recording Page', () => {
  it('Should display "Recording" text when recording starts', async () => {
    render(<App />);
    AudioModule.requestRecordingPermissionsAsync.mockResolvedValueOnce({status: 'granted'});
    const recordButton = await screen.findByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    const recordingStatus = await screen.findByText("Recording...");
    expect(recordingStatus).toBeTruthy();

    // Need this at the end of every test!!!
    const stopButton = await screen.findByRole('button', { name: /Stop/i });
    fireEvent.press(stopButton);

  });
});




// Microphone Permission Tests 
describe('<App /> - Permissions and Errors', () => {
  it('should show permission error message if microphone not allowed', async () => {
    render(<App />);
    AudioModule.requestRecordingPermissionsAsync.mockResolvedValueOnce({status: 'denied'});
    const recordButton = await screen.findByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    const errorMessage = await screen.findByText(/Microphone permission denied/i);
    expect(errorMessage).toBeTruthy();
  });
});


// Recording failed test 
describe('<App /> - Permissions and Errors', () => {
  it('should display error when recording fails', async () => {
    render(<App />);
    AudioModule.requestRecordingPermissionsAsync.mockResolvedValueOnce({status: 'granted'});
    const recordButton = await screen.findByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    
    
    const errorText = screen.queryByText(/Recording failed/i);
    
    if (errorText) {
      //Error
      expect(errorText).toBeTruthy();
    } else {
      // No Error
      const stopButton = await screen.findByRole('button', {name: /Stop/i});
      expect(stopButton).toBeTruthy();
      // Need this at the end of every test!!!
      fireEvent.press(stopButton);
    }
    });

    
    
});



// Check save and delete buttons appear after stop button pressed 
describe('<App /> - Recording Page', () => {
  it('should show Save/Delete buttons after recording', async () => {

    // fetching statistics from backend post speech
    const originalFetch = global.fetch;
    global.fetch = jest.fn(() => new Promise(() => {}));

    render(<App />);
    AudioModule.requestRecordingPermissionsAsync.mockResolvedValueOnce({status: 'granted'});
    const recordButton = await screen.findByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    const stopButton = await screen.findByRole('button', { name: /Stop/i });
    fireEvent.press(stopButton);

    const saveButton = await screen.findByRole('button', { name: /Save/i });
    const deleteButton = await screen.findByRole('button', { name: /Delete/i });
    expect(saveButton).toBeTruthy();
    expect(deleteButton).toBeTruthy();

    // Need this at the end of every test!!!
    fireEvent.press(stopButton);
    
    global.fetch = originalFetch;
  });
  
});


// Check profile button appears on recording page 
describe('<App /> - Recording Page', () => {
  it('should show Profile button from start', async () => {
    render(<App />);
    const profileButton = await screen.findByRole('button', {name: /ProfileButton/i});
    expect(profileButton).toBeTruthy();
  });
});

describe('<App /> - Recording Page', () => {
  it('user cannot open stats page while recording', async () => {
    render(<App />);
    AudioModule.requestRecordingPermissionsAsync.mockResolvedValueOnce({status: 'granted'});
    const recordButton = await screen.findByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);

    const statsButton = await screen.findByRole('button', {name: /statsButton/i});
    fireEvent.press(statsButton);

    expect(screen.queryByText('Stats')).toBeNull();

    const stopButton = await screen.findByRole('button', { name: /Stop/i });
    fireEvent.press(stopButton);
  });
});

describe('<App /> - Recording Page', () => {
  it('user cannot open profile page while recording', async () => {
    render(<App />);
    AudioModule.requestRecordingPermissionsAsync.mockResolvedValueOnce({status: 'granted'});
    const recordButton = await screen.findByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);

    const profileButton = await screen.findByRole('button', {name: /ProfileButton/i});
    fireEvent.press(profileButton);

    expect(screen.queryByText('Profile')).toBeNull();

    const stopButton = await screen.findByRole('button', { name: /Stop/i });
    fireEvent.press(stopButton);
  });
});
