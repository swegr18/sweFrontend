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
  const React = require('react');
  const { View } = require('react-native');

  const createMockComponent = (name) => {
    const Component = (props) => React.createElement(View, props, props.children);
    Component.displayName = name; 
    return Component;
  };

  return {
    __esModule: true,
    default: createMockComponent('Svg'),
    Svg: createMockComponent('Svg'),
    Path: createMockComponent('Path'),
    Circle: createMockComponent('Circle'),
    Rect: createMockComponent('Rect'),
    G: createMockComponent('G'),
    Defs: createMockComponent('Defs'),
    RadialGradient: createMockComponent('RadialGradient'),
    Stop: createMockComponent('Stop'),
    Text: createMockComponent('Text'),
    LinearGradient: createMockComponent('LinearGradient'),
  };
});

jest.mock('react-native-gifted-charts', () => {
  const { View, Text } = require('react-native');
  return {
    LineChart: ({data, formatYLabel, ...props}) => (
      <View {...props} testID="mock...-bar-chart">
        {data?.map((d) => (
          <Text key={d} accessible>{formatYLabel ? formatYLabel(d.value) : d.value}</Text>
        ))}
      </View>
    ),
  };
});

// -------------------------
