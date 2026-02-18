
import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import WpmSpedometer from '../src/wpmSpedometer'; 

// A set of tests for the WPM Spedometer component, for live WPM. Two success states, one failure test.
// Mocks success and failures from backend, and tests if the frontend response is how we want

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

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-1234-abcd-efgh-5678ijklmnop'),
}));

jest.mock('react-native-svg', () => {
  const React = require('react');
  const { View } = require('react-native');

  return {
    __esModule: true,
    default: (props) => <View {...props} testID="svg-root" />,
    Svg: (props) => <View {...props} testID="svg-root" />,
    Path: (props) => <View {...props} testID="svg-path" />,
    Circle: (props) => <View {...props} />,
    Rect: (props) => <View {...props} />,
    G: (props) => <View {...props} />,
  };
});

// -------------------------



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

    const { getByText } = render(<WpmSpedometer {...defaultProps} />);

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

