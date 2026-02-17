import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import WpmSpedometer from '../src/wpmSpedometer'; 

// A set of tests for the WPM Spedometer component, for live WPM. Two success states, one failure test.
// Mocks success and failures from backend, and tests if the frontend response is how we want

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
    jest.clearAllMocks();   
    jest.useFakeTimers(); 

    global.fetch = jest.fn(() => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({}),
    }));
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.clearAllTimers(); // Kill any pending setIntervals
    jest.useRealTimers();  // NOW switch back 
  });

  // Define default props to use in tests
  const defaultProps = {
      sessionId: 'test-session-123',
      chunkIndex: 1
  };

  test('Should displays 0 on failure', async () => {
    // Mock a network error
    fetch.mockRejectedValue(new Error('API Down'));

    const { getByText } = render(<WpmSpedometer {...defaultProps}/>);

    // Mock failure response
    await waitFor(() => {
      expect(getByText(/0/)).toBeTruthy();
    });
  });

  test('Should display the WPM from backend', async () => {
    // Mock success response
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ wpm: 120 }),
    });

    const { getByText } = render(<WpmSpedometer {...defaultProps}/>);

    await waitFor(() => {
      expect(getByText(/120/)).toBeTruthy();
    });
  });

  test('Should update data every 3 seconds (Live wpm)', async () => {
    // First value
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ wpm: 120 }),
    });

    const { getByText } = render(<WpmSpedometer {...defaultProps}/>);

    await waitFor(() => expect(getByText(/120/)).toBeTruthy());

     // Second value 
    fetch.mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ wpm: 155 }),
    });

    
    // advance 3 seconds into future
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    
    await waitFor(() => {
      expect(getByText(/155/)).toBeTruthy();
    });
  });
});