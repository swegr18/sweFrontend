import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  // State: 'idle' | 'recording' | 'finished'
  const [status, setStatus] = useState('idle');

  // Transition: Idle -> Recording
  const handleStartRecording = () => {
    setStatus('recording');
  };

  // Transition: Recording -> Finished
  const handleStopRecording = () => {
    setStatus('finished');
  };

  // Transition: Finished -> Idle (Reset)
  const handleReset = () => {
    setStatus('idle');
  };

  return (
    <View style={styles.container}>
      
      {/* Test: Should display a title for the recording page */}
      <Text style={styles.title}>Record Speech</Text>

      {/* Test: Should display "Recording" text when recording starts */}
      {status === 'recording' && (
        <Text style={styles.statusText}>Recording...</Text>
      )}

      {/* Test: Should display a button to start recording */}
      {status === 'idle' && (
        <Button title="Record" onPress={handleStartRecording} />
      )}

      {/* Test: Should display Stop button when recording starts */}
      {status === 'recording' && (
        <Button title="Stop" onPress={handleStopRecording} color="red" />
      )}

      {/* Test: Should show Save/Delete buttons after recording */}
      {status === 'finished' && (
        <View style={styles.buttonGroup}>
          <Button title="Save" onPress={handleReset} />
          {/* Spacer for visual separation */}
          <View style={{height: 10}} /> 
          <Button title="Delete" onPress={handleReset} color="red" />
        </View>
      )}
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'gray',
  },
  buttonGroup: {
    marginTop: 20,
    width: '80%',
  }
});