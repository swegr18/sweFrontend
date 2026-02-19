import React from 'react';
import { render, screen, fireEvent, waitFor, act} from '@testing-library/react-native';
import App from '../App';

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