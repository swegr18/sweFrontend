// --- ROBUST MOCK SETUP ---
jest.mock('expo-audio', () => ({
  AudioModule: {
    requestRecordingPermissionsAsync: jest.fn(),
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

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  // Override Animated.timing
  RN.Animated.timing = (value, config) => ({
    start: (callback) => {
      value.setValue(config.toValue); // Instantly jump to the final value
      if (callback) {
        callback({ finished: true }); // Trigger the completion callback
      }
    },
  });

  // Override Animated.spring
  RN.Animated.spring = (value, config) => ({
    start: (callback) => {
      value.setValue(config.toValue); 
      if (callback) {
        callback({ finished: true }); 
      }
    },
  });

  RN.Animated.loop = () => ({
    start: () => {},
    stop: () => {},
  });

  return RN;
});

jest.mock('react-native-svg', () => {
  return {
    __esModule: true,
    default: 'Svg',
    Path: 'Path',
    Circle: 'Circle',
    Defs: 'Defs',
    RadialGradient: 'RadialGradient',
    Stop: 'Stop',
    Text: 'Text', 
    Rect: 'Rect'
  };
});

// -------------------------
