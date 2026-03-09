import React from 'react';
import { render, screen, fireEvent, waitFor, act} from '@testing-library/react-native';
import App from '../App';

let fetchSuccess;
let metricsNumber;

beforeEach(() => {
  global.fetch = jest.fn((url) => {
    if(url.includes('/me')){
      return Promise.resolve({
        ok: true,
        json: () => 
          Promise.resolve({
            id: 'fake_user_id',
          }),
      });
    }

    if(url.includes('/graphs')){
      if(fetchSuccess){
        if(metricsNumber == 0){
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve([{
                audio_id: 'fake_audio_id',
                name: 'test speech name',
                created_at: '2026-01-01T13:30:00',
                duration: 10.5,
                wpm: 95.8,
                context_mode: 'In-Person',
                graph_volume: [-40.5,-42.3,-45.8,-30.4,-51.8,-51.7,-56.5,-34.9,-39.0,-42.6],
                graph_freq: [90.4,138.5,14.3,193.6,162.7,183.6,202.5,304.5,265.4,200.0],
              }]),
          })
        }
        else{
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve([{
                audio_id: 'fake_audio_id',
                name: 'test speech name 2',
                created_at: '2026-03-21T09:45:04',
                duration: 5.1,
                wpm: 150.1,
                context_mode: 'Online',
                graph_volume: [-30.5,-41.3,-50.8,-28.4,-43.4],
                graph_freq: [120.1,134.2,135.7,125.8,145.6],
               }]),
          })
        }
      }
      else{
        return Promise.resolve({
          ok: false,
          json: () =>
            Promise.resolve({
              detail: 'Error loading data'
            })
        });
      }
    }

    if (url.includes('/login')) {  
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            access_token: 'fake-token',
          }),
      });
    }
  })
});

afterEach(() => {
  jest.clearAllMocks();
});

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

describe('<App /> - Stats Pop-up', () => {
  it('should show appropriate message when not logged in', async () => {
    render(<App />);

    const statsButton = screen.getByRole('button', { name: /statsButton/i });
    fireEvent.press(statsButton);

    expect(await screen.findByText("Sign in or create an account to view full stats")).toBeTruthy();
  });
});

describe('<App /> - Showing Stats', () => {
  it('should show the name and date of the most recent speech', async () => {
    render(<App />);
    fetchSuccess = true;
    metricsNumber = 0;

    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);
    
    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitButton = await screen.findByRole('button', { name: /LoginSubmit/i });
    
    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "password12!");
    fireEvent.press(submitButton);

    const closeProfileButton = await screen.findByRole('button', {name: /ClosePopup/i});
    fireEvent.press(closeProfileButton);
    
    const statsButton = await screen.findByRole('button', { name: /statsButton/i });
    fireEvent.press(statsButton);

    expect(await screen.findByText("test speech name")).toBeTruthy();
    expect(await screen.findByText("1-Jan")).toBeTruthy();
  });
});

describe('<App /> - Showing Stats', () => {
  it('should say loading until metrics are fetched', async () => {
    render(<App />);
    fetchSuccess = false;

    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);
    
    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitButton = await screen.findByRole('button', { name: /LoginSubmit/i });
    
    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "password12!");
    fireEvent.press(submitButton);

    const closeProfileButton = await screen.findByRole('button', {name: /ClosePopup/i});
    fireEvent.press(closeProfileButton);
    
    const statsButton = await screen.findByRole('button', { name: /statsButton/i });
    fireEvent.press(statsButton);

    expect(screen.queryByText("test speech name")).toBeNull();
    expect(screen.queryByText("1-Jan")).toBeNull();
    expect(await screen.findByText("Loading...")).toBeTruthy();
  });
});

describe('<App /> - Showing Stats', () => {
  it('pressing dropdown button should toggle visibility', async () => {
    render(<App />);
    fetchSuccess = true;
    metricsNumber = 0;

    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);
    
    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitButton = await screen.findByRole('button', { name: /LoginSubmit/i });
    
    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "password12!");
    fireEvent.press(submitButton);

    const closeProfileButton = await screen.findByRole('button', {name: /ClosePopup/i});
    fireEvent.press(closeProfileButton);
    
    const statsButton = await screen.findByRole('button', { name: /statsButton/i });
    fireEvent.press(statsButton);

    expect(await screen.findByText("test speech name")).toBeTruthy();
    expect(await screen.findByText("1-Jan")).toBeTruthy();
    expect(await screen.findByText("13:30")).toBeTruthy();
    expect(await screen.findByText("WPM")).toBeTruthy();
    expect(await screen.findByText("DURATION (s)")).toBeTruthy();
    expect(await screen.findByText("VOLUME (db)")).toBeTruthy();
    expect(await screen.findByText("PITCH (Hz)")).toBeTruthy();

    const dropdownButton = await screen.findByRole('button', {name: /DropdownButton/i });
    fireEvent.press(dropdownButton);

    expect(await screen.findByText("test speech name")).toBeTruthy();
    expect(await screen.findByText("1-Jan")).toBeTruthy();
    expect(screen.queryByText("13:30")).toBeNull();
  });
});

describe('<App /> - Showing Stats', () => {
  it('date is displayed correctly for all cases', async () => {
    render(<App />);
    fetchSuccess = true;
    metricsNumber = 1;

    const profileButton = screen.getByRole('button', { name: /ProfileButton/i });
    fireEvent.press(profileButton);
    
    const emailField = await screen.findByPlaceholderText('Email Address');
    const passwordField = await screen.findByPlaceholderText('Password');
    const submitButton = await screen.findByRole('button', { name: /LoginSubmit/i });
    
    fireEvent.changeText(emailField, "testemail@gmail.com");
    fireEvent.changeText(passwordField, "password12!");
    fireEvent.press(submitButton);

    const closeProfileButton = await screen.findByRole('button', {name: /ClosePopup/i});
    fireEvent.press(closeProfileButton);
    
    const statsButton = await screen.findByRole('button', { name: /statsButton/i });
    fireEvent.press(statsButton);

    expect(await screen.findByText("test speech name 2")).toBeTruthy();
    expect(await screen.findByText("21-Mar")).toBeTruthy();
    expect(await screen.findByText("09:45")).toBeTruthy();
  });
});