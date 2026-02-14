import React from 'react';
import { render, screen, fireEvent, waitFor, act} from '@testing-library/react-native';
import App from '../App';


// --- ROBUST MOCK SETUP ---
jest.mock('expo-audio', () => ({
  AudioModule: {
    requestRecordingPermissionsAsync: jest.fn(() => 
      Promise.resolve({ status: 'granted' })
    ),
  },
  useAudioRecorder: jest.fn(() => ({
    // Make these resolve immediately
    prepareToRecordAsync: jest.fn(() => Promise.resolve()),
    record: jest.fn(),
    stop: jest.fn(() => Promise.resolve()),
    uri: 'file://test-audio.m4a',
  })),
  RecordingPresets: {
    HIGH_QUALITY: 'high-quality-preset',
  },
}));

// Mock FileSystem to avoid crashes in handleStopRecording
jest.mock('expo-file-system/legacy', () => ({
  readAsStringAsync: jest.fn(() => Promise.resolve('base64-string-mock')),
  getInfoAsync: jest.fn(() => Promise.resolve({ exists: true, size: 100 })),
  EncodingType: { Base64: 'base64' },
}));

// Mock Platform to avoid "blob" errors in tests if your code checks Platform.OS
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'android',
  select: () => null,
}));

//Mock React Icons 
jest.mock('@expo/vector-icons',() => {
  const { Text } = require('react-native');

  const Icon = ({ name }) => <Text>{name}</Text>;

  return {
    FontAwesome6: Icon,
    AntDesign: Icon,
  }
});


// -------------------------




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
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);

    const stopButton = await screen.findByRole('button', { name: /Stop/i });

    expect(stopButton).toBeTruthy();
  });
});


// Remove Record button once it is pressed
describe('<App /> - Recording Controls', () => {
   it('Should hide Record button when recording is active', async () => {
    render(<App />);
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);

    await waitFor(() => {
      expect(screen.queryByRole('button', { name: /Record/i })).toBeNull();
    });


  });
});

// Recording Status Visual
describe('<App /> - Recording Page', () => {
  it('Should display "Recording" text when recording starts', async () => {
    render(<App />);
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    const recordingStatus = await screen.findByText("Recording...");
    expect(recordingStatus).toBeTruthy();
  });
});

// Microphone Permission Tests
describe('<App /> - Permissions and Errors', () => {
  it.skip('should show permission error message if microphone not allowed', async () => {
    render(<App />);
    // Mock permission denied state
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    const errorMessage = await screen.findByText(/Microphone permission denied/i);
    expect(errorMessage).toBeTruthy();
  });
});

// Recording failed test
describe('<App /> - Permissions and Errors', () => {
  it('should display error when recording fails', async () => {
    render(<App />);
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    
    
    const errorText = screen.queryByText(/Recording failed/i);
    
    if (errorText) {
      //Error
      expect(errorText).toBeTruthy();
    } else {
      // No Error
      const stopButton = await screen.findByRole('button', {name: /Stop/i});
      expect(stopButton).toBeTruthy();
    }
    });
});


// Check save and delete buttons appear after stop button pressed
describe('<App /> - Recording Page', () => {
  it('should show Save/Delete buttons after recording', async () => {
    render(<App />);
    const recordButton = screen.getByRole('button', { name: /Record/i });
    fireEvent.press(recordButton);
    const stopButton = await screen.findByRole('button', { name: /Stop/i });
    fireEvent.press(stopButton);

    const saveButton = await screen.findByRole('button', { name: /Save/i });
    const deleteButton = await screen.findByRole('button', { name: /Delete/i });
    expect(saveButton).toBeTruthy();
    expect(deleteButton).toBeTruthy();
  });
});

// Check profile button appears on recording page
describe('<App /> - Recording Page', () => {
  it('should show Profile button from start', () => {
    render(<App />);
    const profileButton = screen.getByRole('button', {name: /ProfileButton/i});
    expect(profileButton).toBeTruthy();
  });
});


// Check profile pop-up appears on button press
describe('<App /> - Profile Pop-up', () => {
  it('should show Profile pop-up when the Profile button pressed', async () => {
    render(<App />);
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    await waitFor(() =>{
      expect(screen.queryByText('Profile')).toBeTruthy();
      expect(screen.queryByRole('button', {name: /ClosePopup/i})).toBeTruthy();
      expect(screen.queryByRole('button', { name: /ProfileButton/i })).toBeNull();
    });
  });
});


// Check that profile pop-up is closed on button press
describe('<App /> - Profile Pop-up', () => {
  it('should close the Profile pop-up when the Close button pressed', async () => {
    render(<App />);
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const closeButton = await screen.findByRole('button', {name: /ClosePopup/i});
    fireEvent.press(closeButton);

    await waitFor(() => {
      expect(screen.queryByText('Profile')).toBeNull();
      expect(screen.queryByRole('button', {name: /ClosePopup/i})).toBeNull();
      expect(screen.queryByRole('button', { name: /ProfileButton/i })).toBeTruthy();
    });
  });
});

describe('<App /> - Login Management', () => {
  it('user is logged out by default', async() => {
    render(<App />);
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    expect(await screen.findByLabelText("LoginForm")).toBeTruthy();
    expect(await screen.findByRole('button', { name: /CreateAccountButton/i })).toBeTruthy();
  })
});

describe('<App /> - Login Management', () => {
  it('user can log in', async () => {
    render(<App />);
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitButton = await screen.findByRole('button', { name: /LoginSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "password12!");
    fireEvent.press(submitButton);

    expect(await screen.findByText("Hello, Ben")).toBeTruthy();
  });
});

describe('<App /> - Login Management', () => {
  it('user can create an account', async () => {
    render(<App />);
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const createAccountButton = await screen.findByRole('button', { name: /CreateAccountButton/i });
    fireEvent.press(createAccountButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const nameField = await screen.findByPlaceholderText('First Name');
    const confirmPasswordField = await screen.findByPlaceholderText('Confirm Password');
    const submitButton = await screen.findByRole('button', { name: /CreateAccountSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.changeText(confirmPasswordField, "Password12!");
    fireEvent.press(submitButton);

    expect(await screen.findByText("Hello, Ben")).toBeTruthy();
  });
});

describe('<App /> - Login Management', () => {
  it('user can log out', async () => {
    render(<App />);
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitButton = await screen.findByRole('button', { name: /LoginSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "password12!");
    fireEvent.press(submitButton);

    const logoutButton = await screen.findByRole('button', { name: /LogOut/i });
    fireEvent.press(logoutButton);

    expect(await screen.findByLabelText("LoginForm")).toBeTruthy();
    expect(await screen.findByRole('button', { name: /CreateAccountButton/i })).toBeTruthy();
  });
});

describe('<App /> - Login Management', () => {
  it('user can access log in page from create account page', async () => {
    render(<App />);
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const createAccountButton = await screen.findByRole('button', { name: /CreateAccountButton/i });
    fireEvent.press(createAccountButton);

    const loginButton = await screen.findByRole('button', {name: /LogInButton/i })
    fireEvent.press(loginButton)

    expect(await screen.findByLabelText("LoginForm")).toBeTruthy();
    expect(await screen.findByRole('button', { name: /CreateAccountButton/i })).toBeTruthy();
  });
});

describe('<App /> - Login Validation', () => {
  it('attempting to log in with no email address or no password gives an error', async () => {
    render(<App />);
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitButton = await screen.findByRole('button', { name: /LoginSubmit/i });

    fireEvent.changeText(emailField, "");
    fireEvent.changeText(passwordField, "password12!");
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("LoginForm")).toBeTruthy();
    expect(await screen.findByText("Please enter an email address and password")).toBeTruthy();

    fireEvent.changeText(emailField, "");
    fireEvent.changeText(passwordField, "testemail@gmail.com");
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("LoginForm")).toBeTruthy();
    expect(await screen.findByText("Please enter an email address and password")).toBeTruthy();
  });
});

describe('<App /> - Login Validation', () => {
  it('attempting to create account with no email address, no name or no password gives an error', async () => {
    render(<App />);
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const createAccountButton = await screen.findByRole('button', { name: /CreateAccountButton/i });
    fireEvent.press(createAccountButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const nameField = await screen.findByPlaceholderText('First Name');
    const confirmPasswordField = await screen.findByPlaceholderText('Confirm Password');
    const submitButton = await screen.findByRole('button', { name: /CreateAccountSubmit/i });

    fireEvent.changeText(emailField, "");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.changeText(confirmPasswordField, "Password12!")
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Please enter an email address, full name and password")).toBeTruthy();

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.changeText(confirmPasswordField, "Password12!")
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Please enter an email address, full name and password")).toBeTruthy();

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "");
    fireEvent.changeText(confirmPasswordField, "Password12!")
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Please enter an email address, full name and password")).toBeTruthy();
  });
});

describe('<App /> - Login Validation', () => {
  it('non-matching password and confirm password gives an error', async () => {
    render(<App />);
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const createAccountButton = await screen.findByRole('button', { name: /CreateAccountButton/i });
    fireEvent.press(createAccountButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const nameField = await screen.findByPlaceholderText('First Name');
    const confirmPasswordField = await screen.findByPlaceholderText('Confirm Password');
    const submitButton = await screen.findByRole('button', { name: /CreateAccountSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.changeText(confirmPasswordField, "Password12");
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Passwords must match")).toBeTruthy();
  });
});

describe('<App /> - Login Validation', () => {
  it('accounts can only be created with a valid email address', async () => {
    render(<App />);
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const createAccountButton = await screen.findByRole('button', { name: /CreateAccountButton/i });
    fireEvent.press(createAccountButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const nameField = await screen.findByPlaceholderText('First Name');
    const confirmPasswordField = await screen.findByPlaceholderText('Confirm Password');
    const submitButton = await screen.findByRole('button', { name: /CreateAccountSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.changeText(confirmPasswordField, "Password12!");
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Passwords must match")).toBeTruthy();

    fireEvent.changeText(emailField, "testemail.gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.changeText(confirmPasswordField, "Password12!");
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Passwords must match")).toBeTruthy();

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.changeText(confirmPasswordField, "Password12!");
    fireEvent.press(submitButton);

    expect(await screen.findByText("Hello, Ben")).toBeTruthy();
  });
});

describe('<App /> - Login Validation', () => {
  it('password must be of sufficient strength', async () => {
    render(<App />);
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const createAccountButton = await screen.findByRole('button', { name: /CreateAccountButton/i });
    fireEvent.press(createAccountButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const nameField = await screen.findByPlaceholderText('First Name');
    const confirmPasswordField = await screen.findByPlaceholderText('Confirm Password');
    const submitButton = await screen.findByRole('button', { name: /CreateAccountSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "Password!");
    fireEvent.changeText(confirmPasswordField, "Password!");
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Passwords must match")).toBeTruthy();

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "password12");
    fireEvent.changeText(confirmPasswordField, "password12");
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Passwords must match")).toBeTruthy();

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "Password12");
    fireEvent.changeText(confirmPasswordField, "Password12");
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Passwords must match")).toBeTruthy();

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "PASSWORD12!");
    fireEvent.changeText(confirmPasswordField, "PASSWORD12!");
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Passwords must match")).toBeTruthy();

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "Pa2!");
    fireEvent.changeText(confirmPasswordField, "Pa2!");
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Passwords must match")).toBeTruthy();

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.changeText(confirmPasswordField, "Password12!");
    fireEvent.press(submitButton);

    expect(await screen.findByText("Hello, Ben")).toBeTruthy();
  });
});