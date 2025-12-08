import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  const [status, setStatus] = useState('idle');

  const handleStartRecording = () => {
    setStatus('recording');
  };

  const handleStopRecording = () => {
    setStatus('finished');
  };

  const handleReset = () => {
    setStatus('idle');
  };

  return (
    // Replaced SafeAreaView with View and added paddingTop in styles
    <View style={appStyles.container}>
      <View style={appStyles.contentContainer}>
        
        {/* Title */}
        <Text style={appStyles.title}>Record Speech</Text>

        {/* Recording Status Text */}
        {status === 'recording' && (
          <Text style={appStyles.statusText}>Recording...</Text>
        )}

        {/* Record Button - Only shows when idle */}
        {status === 'idle' && (
          <Button 
            title="Record" 
            onPress={handleStartRecording} 
          />
        )}

        {/* Stop Button - Only shows when recording */}
        {status === 'recording' && (
          <Button 
            title="Stop" 
            onPress={handleStopRecording} 
            color="red"
          />
        )}

        {/* Save/Delete Buttons - Only shows when finished */}
        {status === 'finished' && (
          <View style={appStyles.buttonGroup}>
            <Button title="Save" onPress={handleReset} />
            {/* Small spacer view for separation */}
            <View style={{height: 10}} /> 
            <Button title="Delete" onPress={handleReset} color="red" />
          </View>
        )}

      </View>
    </View>
  );
}

// Renamed to 'appStyles' to avoid conflicts if you have a global 'styles' variable
const appStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center', 
    paddingTop: 50, // Manual padding to replace SafeAreaView
  },
  contentContainer: {
    width: '80%',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#000',
  },
  statusText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'gray',
  },
  buttonGroup: {
    marginTop: 20,
    width: '100%',
  }
});