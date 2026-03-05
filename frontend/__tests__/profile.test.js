import React from 'react';
import { render, screen, fireEvent, waitFor, act} from '@testing-library/react-native';
import App from '../App';

let fetchSuccess;

beforeEach(() => {
  global.fetch = jest.fn((url) => {

    if (url.includes('/login')) {
      if(fetchSuccess){
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              access_token: 'fake-token',
            }),
        });
      }
      else{
        return Promise.resolve({
          ok: false,
          json: () =>
            Promise.resolve({
              detail: 'Invalid email or password',
            }),
          });
      }
    }

    if (url.includes('/register')) {
      if(fetchSuccess){
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve({
              access_token: 'fake-token',
            }),
        });
      }
      else{
        return Promise.resolve({
          ok: false,
          json: () =>
            Promise.resolve({
              detail: 'A user with this email already exists',
            }),
        });
      }
    }

    if (url.includes('/me')) {
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            username: 'Ben',
          }),
      });
    }

    if (url.includes('/email')) {
      if(fetchSuccess){
        return Promise.resolve({
          ok: true,
          json: () => 
            Promise.resolve({}),
        });
      }
      else{
        return Promise.resolve({
          ok: false,
          json: () => 
            Promise.resolve({
              detail: 'A user with this email already exists',
            }),
        });
      }
    }

    if (url.includes('/password')) {
      if(fetchSuccess){
        return Promise.resolve({
          ok: true,
          json: () => 
            Promise.resolve({}),
        });
      }
      else{
        return Promise.resolve({
          ok: false,
          json: () => 
            Promise.resolve({
              detail: 'Current password is incorrect',
            }),
        });
      }
    }
  });
});

afterEach(() => {
  jest.clearAllMocks();
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
    fetchSuccess = true;
    
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
  it('incorrect login gives appropriate error', async () => {
    render(<App />);
    fetchSuccess = false;
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitButton = await screen.findByRole('button', { name: /LoginSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "password13!");
    fireEvent.press(submitButton);

    expect(await screen.findByText("Invalid email or password")).toBeTruthy();
  });
});

describe('<App /> - Login Management', () => {
  it('user is still logged in after closing the profile popup', async () => {
    render(<App />);
    fetchSuccess = true;
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitButton = await screen.findByRole('button', { name: /LoginSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "password12!");
    fireEvent.press(submitButton);

    const closeButton = await screen.findByRole('button', { name: /ClosePopup/i });
    fireEvent.press(closeButton);

    const profileButton2 = await screen.findByRole('button', { name: /ProfileButton/i })
    fireEvent.press(profileButton2);

    expect(await screen.findByText("Hello, Ben")).toBeTruthy();
  });
});

describe('<App /> - Login Management', () => {
  it('user can create an account', async () => {
    render(<App />);
    fetchSuccess = true;
    
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
  it('account creation failure gives appropriate message', async () => {
    render(<App />);
    fetchSuccess = false;
    
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

    expect(await screen.findByText("A user with this email already exists")).toBeTruthy();
  });
});

describe('<App /> - Login Management', () => {
  it('user can log out', async () => {
    render(<App />);
    fetchSuccess = true;
    
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
    expect(await screen.findByText("Please enter an email address, first name and password")).toBeTruthy();

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.changeText(confirmPasswordField, "Password12!")
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Please enter an email address, first name and password")).toBeTruthy();

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "");
    fireEvent.changeText(confirmPasswordField, "Password12!")
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Please enter an email address, first name and password")).toBeTruthy();
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
    fetchSuccess = true;
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const createAccountButton = await screen.findByRole('button', { name: /CreateAccountButton/i });
    fireEvent.press(createAccountButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const nameField = await screen.findByPlaceholderText('First Name');
    const confirmPasswordField = await screen.findByPlaceholderText('Confirm Password');
    const submitButton = await screen.findByRole('button', { name: /CreateAccountSubmit/i });

    let invalidEmails = ["testemail@gmail","testemail.gmail.com","test:email@gmail.com","test email@gmail.com","testemail@gmail.com.","testemail@gmail..com","testemail@g_mail.com","testemail@gmail.co.u"];
    for(let i = 0; i < invalidEmails.length; i++){
      fireEvent.changeText(emailField, invalidEmails[i]);
      fireEvent.changeText(nameField, "Ben");
      fireEvent.changeText(passwordField, "Password12!");
      fireEvent.changeText(confirmPasswordField, "Password12!");
      fireEvent.press(submitButton);

      expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
      expect(await screen.findByText("Please enter a valid email address")).toBeTruthy();
    }

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
    fetchSuccess = true;
    
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
    expect(await screen.findByText("Password must contain at least one number")).toBeTruthy();

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "password12!");
    fireEvent.changeText(confirmPasswordField, "password12!");
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Password must contain at least one upper case character")).toBeTruthy();

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "Password12");
    fireEvent.changeText(confirmPasswordField, "Password12");
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Password must contain at least one special character")).toBeTruthy();

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "PASSWORD12!");
    fireEvent.changeText(confirmPasswordField, "PASSWORD12!");
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Password must contain at least one lower case character")).toBeTruthy();

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "Pa2!");
    fireEvent.changeText(confirmPasswordField, "Pa2!");
    fireEvent.press(submitButton);

    expect(await screen.findByLabelText("CreateAccountForm")).toBeTruthy();
    expect(await screen.findByText("Password must be at least 7 characters")).toBeTruthy();

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(nameField, "Ben");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.changeText(confirmPasswordField, "Password12!");
    fireEvent.press(submitButton);

    expect(await screen.findByText("Hello, Ben")).toBeTruthy();
  });
});

describe('<App /> - User Settings', () => {
  it('settings button shows only when logged in', async() => {
    render(<App />);
    fetchSuccess = true;
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitButton = await screen.findByRole('button', { name: /LoginSubmit/i });

    expect(screen.queryByRole('button', {name: /SettingsButton/i })).toBeNull();

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "password12!");
    fireEvent.press(submitButton);

    expect(await screen.findByRole('button', {name: /SettingsButton/i })).toBeTruthy();

    const logoutButton = await screen.findByRole('button', { name: /LogOut/i });
    fireEvent.press(logoutButton);

    const createAccountButton = await screen.findByRole('button', { name: /CreateAccountButton/i });
    fireEvent.press(createAccountButton);

    expect(screen.queryByRole('button', {name: /SettingsButton/i })).toBeNull();
  });
});

describe('<App /> - User Settings', () => {
  it('settings page opens when settings button pressed', async() => {
    render(<App />);
    fetchSuccess = true;
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitButton = await screen.findByRole('button', { name: /LoginSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "password12!");
    fireEvent.press(submitButton);

    const settingsButton = await screen.findByRole('button', {name: /SettingsButton/i });
    fireEvent.press(settingsButton);
    
    expect(await screen.findByText("User Settings")).toBeTruthy();
  })
});

describe('<App /> - User Settings', () => {
  it('back button allows user to return to logged in page from settings page', async() => {
    render(<App />);
    fetchSuccess = true;
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitButton = await screen.findByRole('button', { name: /LoginSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "password12!");
    fireEvent.press(submitButton);

    const settingsButton = await screen.findByRole('button', {name: /SettingsButton/i });
    fireEvent.press(settingsButton);

    const backButton = await screen.findByRole('button', {name: /ExitSettingsButton/i });
    fireEvent.press(backButton);

    expect(await screen.findByText("Hello, Ben")).toBeTruthy();
  });
})

describe('<App /> - User Settings', () => {
  it('user can change their email address to a different, valid email address', async() => {
    render(<App />);
    fetchSuccess = true;
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitLogInButton = await screen.findByRole('button', { name: /LoginSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.press(submitLogInButton);

    const settingsButton = await screen.findByRole('button', {name: /SettingsButton/i });
    fireEvent.press(settingsButton);

    const newEmailField = await screen.findByPlaceholderText('New Email Address');
    const submitButton = await screen.findByRole('button', {name: /ChangeEmailSubmit/i})

    fireEvent.press(submitButton);
    expect(await screen.findByText("Please enter an email address")).toBeTruthy();

    let invalidEmails = ["testemail@gmail","testemail.gmail.com","test:email@gmail.com","test email@gmail.com","testemail@gmail.com.","testemail@gmail..com","testemail@g_mail.com","testemail@gmail.co.u"];
    for(let i = 0; i < invalidEmails.length; i++){
      fireEvent.changeText(newEmailField, invalidEmails[i]);
      fireEvent.press(submitButton);

      expect(await screen.findByText("Please enter a valid email address")).toBeTruthy();
    }

    fireEvent.changeText(newEmailField, "testemail@gmail.com");
    fireEvent.press(submitButton);

    expect(await screen.findByText("New email address cannot be the same as current")).toBeTruthy();

    fireEvent.changeText(newEmailField, "testemail1@gmail.com");
    fireEvent.press(submitButton);
    expect(await screen.findByText("Email successfully changed")).toBeTruthy();
  });
});

describe('<App /> - User Settings', () => {
  it('unsuccessful email change gives appropriate error message', async() => {
    render(<App />);
    fetchSuccess = true;
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitLogInButton = await screen.findByRole('button', { name: /LoginSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.press(submitLogInButton);

    const settingsButton = await screen.findByRole('button', {name: /SettingsButton/i });
    fireEvent.press(settingsButton);
    
    fetchSuccess = false;

    const newEmailField = await screen.findByPlaceholderText('New Email Address');
    const submitButton = await screen.findByRole('button', {name: /ChangeEmailSubmit/i})

    fireEvent.changeText(newEmailField, "testemail1@gmail.com");
    fireEvent.press(submitButton);
    expect(await screen.findByText("A user with this email already exists")).toBeTruthy();
  });
});

describe('<App /> - User Settings', () => {
  it('user can change their password to a sufficiently strong one', async() => {
    render(<App />);
    fetchSuccess = true;
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitLogInButton = await screen.findByRole('button', { name: /LoginSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.press(submitLogInButton);

    const settingsButton = await screen.findByRole('button', {name: /SettingsButton/i });
    fireEvent.press(settingsButton);

    const currentPasswordField = await screen.findByPlaceholderText('Current Password')
    const newPasswordField = await screen.findByPlaceholderText('New Password');
    const confirmPasswordField = await screen.findByPlaceholderText('Confirm New Password');
    const submitButton = await screen.findByRole('button', {name: /ChangePasswordSubmit/i });

    fireEvent.press(submitButton);

    expect(await screen.findByText("Please enter a password")).toBeTruthy();

    fireEvent.changeText(currentPasswordField, "Password12!");
    fireEvent.changeText(newPasswordField, "Password12!");
    fireEvent.changeText(confirmPasswordField, "Password12!");
    fireEvent.press(submitButton);

    expect(await screen.findByText("New password cannot be the same as current one")).toBeTruthy();

    fireEvent.changeText(currentPasswordField, "Password12!");
    fireEvent.changeText(newPasswordField, "Password!");
    fireEvent.changeText(confirmPasswordField, "Password!");
    fireEvent.press(submitButton);

    expect(await screen.findByText("Password must contain at least one number")).toBeTruthy();

    fireEvent.changeText(currentPasswordField, "Password12!");
    fireEvent.changeText(newPasswordField, "Password13!");
    fireEvent.changeText(confirmPasswordField, "Password13");
    fireEvent.press(submitButton);

    expect(await screen.findByText("Passwords must match")).toBeTruthy();

    fireEvent.changeText(currentPasswordField, "Password12!");
    fireEvent.changeText(newPasswordField, "password13!");
    fireEvent.changeText(confirmPasswordField, "password13!");
    fireEvent.press(submitButton);

    expect(await screen.findByText("Password must contain at least one upper case character")).toBeTruthy();

    fireEvent.changeText(currentPasswordField, "Password12!");
    fireEvent.changeText(newPasswordField, "Password13");
    fireEvent.changeText(confirmPasswordField, "Password13");
    fireEvent.press(submitButton);

    expect(await screen.findByText("Password must contain at least one special character")).toBeTruthy();

    fireEvent.changeText(currentPasswordField, "Password12!");
    fireEvent.changeText(newPasswordField, "PASSWORD13!");
    fireEvent.changeText(confirmPasswordField, "PASSWORD13!");
    fireEvent.press(submitButton);

    expect(await screen.findByText("Password must contain at least one lower case character")).toBeTruthy();

    fireEvent.changeText(currentPasswordField, "Password12!");
    fireEvent.changeText(newPasswordField, "Pa3!");
    fireEvent.changeText(confirmPasswordField, "Pa3!");
    fireEvent.press(submitButton);

    expect(await screen.findByText("Password must be at least 7 characters")).toBeTruthy();

    fireEvent.changeText(currentPasswordField, "Password12!");
    fireEvent.changeText(newPasswordField, "Password13!");
    fireEvent.changeText(confirmPasswordField, "Password13!");
    fireEvent.press(submitButton);

    expect(await screen.findByText("Password successfully changed")).toBeTruthy();
  });
});

describe('<App /> - User Settings', () => {
  it('unsuccessful password change gives appropriate error', async() => {
    render(<App />);
    fetchSuccess = true;
    
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitLogInButton = await screen.findByRole('button', { name: /LoginSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.press(submitLogInButton);

    const settingsButton = await screen.findByRole('button', {name: /SettingsButton/i });
    fireEvent.press(settingsButton);

    fetchSuccess = false;

    const currentPasswordField = await screen.findByPlaceholderText('Current Password')
    const newPasswordField = await screen.findByPlaceholderText('New Password');
    const confirmPasswordField = await screen.findByPlaceholderText('Confirm New Password');
    const submitButton = await screen.findByRole('button', {name: /ChangePasswordSubmit/i });

    fireEvent.changeText(currentPasswordField, "Password12!");
    fireEvent.changeText(newPasswordField, "Password13!");
    fireEvent.changeText(confirmPasswordField, "Password13!");
    fireEvent.press(submitButton);

    expect(await screen.findByText("Current password is incorrect")).toBeTruthy();
  });
});

describe('<App /> - Deleting Account', () => {
  it('user can open a page that allows them to delete their account', async() => {
    render(<App />);
    fetchSuccess = true;
  
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitLogInButton = await screen.findByRole('button', { name: /LoginSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.press(submitLogInButton);

    const settingsButton = await screen.findByRole('button', {name: /SettingsButton/i });
    fireEvent.press(settingsButton);
    
    const openDeleteButton = await screen.findByRole('button', {name: /DeleteAccountButton/i});
    fireEvent.press(openDeleteButton);

    expect(await screen.findAllByText("Delete Account")).toBeTruthy();
  });
});

describe('<App /> - Deleting Account', () => {
  it('user can go back to settings page from delete page', async() => {
    render(<App />);
    fetchSuccess = true;
  
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitLogInButton = await screen.findByRole('button', { name: /LoginSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.press(submitLogInButton);

    const settingsButton = await screen.findByRole('button', {name: /SettingsButton/i });
    fireEvent.press(settingsButton);
    
    const openDeleteButton = await screen.findByRole('button', {name: /DeleteAccountButton/i});
    fireEvent.press(openDeleteButton);

    const backButton = await screen.findByRole('button', {name: /DontDeleteAccountButton/i});
    fireEvent.press(backButton);

    expect(await screen.findByText("User Settings")).toBeTruthy();
  });
});

describe('<App /> - Deleting Account', () => {
  it('user can delete account', async() => {
    render(<App />);
    fetchSuccess = true;
  
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitLogInButton = await screen.findByRole('button', { name: /LoginSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.press(submitLogInButton);

    const settingsButton = await screen.findByRole('button', {name: /SettingsButton/i });
    fireEvent.press(settingsButton);
    
    const openDeleteButton = await screen.findByRole('button', {name: /DeleteAccountButton/i});
    fireEvent.press(openDeleteButton);

    const checkbox = await screen.findByRole('checkbox', {name: /ConfirmDeleteCheckbox/i});
    const passwordField2 = await screen.findByPlaceholderText('Password');
    const confirmButton = await screen.findByRole('button', {name: /ConfirmDeleteAccountButton/i});

    fireEvent.press(checkbox);
    fireEvent.changeText(passwordField2, "Password12!");
    fireEvent.press(confirmButton);

    expect(await screen.findByLabelText("LoginForm")).toBeTruthy();
    expect(await screen.findByRole('button', { name: /CreateAccountButton/i })).toBeTruthy();
  });
});

describe('<App /> - Deleting Account', () => {
  it('unsuccessful account deletion gives appropriate errors', async() => {
    render(<App />);
    fetchSuccess = true;
  
    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);

    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitLogInButton = await screen.findByRole('button', { name: /LoginSubmit/i });

    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "Password12!");
    fireEvent.press(submitLogInButton);

    const settingsButton = await screen.findByRole('button', {name: /SettingsButton/i });
    fireEvent.press(settingsButton);
    
    const openDeleteButton = await screen.findByRole('button', {name: /DeleteAccountButton/i});
    fireEvent.press(openDeleteButton);

    const checkbox = await screen.findByRole('checkbox', {name: /ConfirmDeleteCheckbox/i});
    const passwordField2 = await screen.findByPlaceholderText('Password');
    const confirmButton = await screen.findByRole('button', {name: /ConfirmDeleteAccountButton/i});

    fireEvent.press(confirmButton);

    expect(await screen.findByText("Please check the box before proceeding")).toBeTruthy();

    fireEvent.press(checkbox);
    fireEvent.press(confirmButton);

    expect(await screen.findByText("Please enter your password")).toBeTruthy();

    fireEvent.press(checkbox);
    fireEvent.changeText(passwordField2, "Password12!");
    fireEvent.press(confirmButton);

    expect(await screen.findByText("Please check the box before proceeding")).toBeTruthy();
  });
});