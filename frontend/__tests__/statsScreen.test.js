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

jest.mock('uuid', () => ({
  v4: jest.fn(() => 'mock-uuid-1234-abcd-efgh-5678ijklmnop'),
}));


// -------------------------

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