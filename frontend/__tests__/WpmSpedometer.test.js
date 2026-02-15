import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import WpmSpedometer from '../src/wpmSpedometer'; 


// A set of tests for the WPM Spedometer component, for live WPM. Two success states, one failure test.
// Mocks success and failures from backend, and tests if the frontend response is how we want

// Mock fetch globally
global.fetch = jest.fn();

jest.mock('expo-audio', () => ({
  AudioModule: {
    // Force the permission request to resolve immediately with 'granted'
    requestRecordingPermissionsAsync: jest.fn().mockResolvedValue({ 
      status: 'granted', 
      granted: true 
    }),
  },
}));


describe('WPM Spedometer -', () => {
  
  beforeEach(() => {
    jest.resetAllMocks();
    global.fetch = jest.fn();
    jest.useFakeTimers(); 
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('Should displays 0 on failure', async () => {
    // Mock a network error
    fetch.mockRejectedValue(new Error('API Down'));

    const { getByText } = render(<WpmSpedometer />);

    // Mock failure response
    await waitFor(() => {
      expect(getByText('0')).toBeTruthy();
    });
  });

  test('Should display the WPM from backend', async () => {
    // Mock success response
    fetch.mockResolvedValue({
      json: () => Promise.resolve({ wpm: 120 }),
    });

    const { getByText } = render(<WpmSpedometer />);

    await waitFor(() => {
      expect(getByText('120')).toBeTruthy();
    });
  });

  test('Should update data every 3 seconds (Live wpm)', async () => {
    // First value
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ wpm: 120 }),
    });

    const { getByText } = render(<WpmSpedometer />);
    await waitFor(() => expect(getByText('120')).toBeTruthy());

    // Second value 
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ wpm: 155 }),
    });

    // advance 3 seconds into future
    act(() => {
      jest.advanceTimersByTime(3000);
    });

    await waitFor(() => {
      expect(getByText('155')).toBeTruthy();
    });
  });
});