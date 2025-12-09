import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, Platform } from 'react-native';
// Removed useAudioRecorderState from imports
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
} from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';

export default function App() {
  // status of the recording page
  const [status, setStatus] = useState('idle');
  const [permissionResponse, setPermissionResponse] = useState(null);

  // Setup microphone
  // We pass the preset directly to the hook
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  
  // REMOVED: const recorderState = useAudioRecorderState(audioRecorder); 
  // You don't need this hook since you are managing 'status' yourself.

  // Request permissions on app load
  useEffect(() => {
    (async () => {
      const response = await AudioModule.requestRecordingPermissionsAsync();
      setPermissionResponse(response);
    })();
  }, []);

  // Transition: Idle -> Recording
  const handleStartRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        const response = await AudioModule.requestRecordingPermissionsAsync();
        setPermissionResponse(response);
        if (response.status !== 'granted') {
          Alert.alert("Permission required", "Please grant microphone permission to record.");
          return;
        }
      }

      // Start recording
      // Note: prepareToRecordAsync is often called internally by record(), 
      // but calling it explicitly ensures the file is ready.
      await audioRecorder.prepareToRecordAsync(RecordingPresets.HIGH_QUALITY);
      audioRecorder.record();
      
      setStatus('recording');
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };

  // Transition: Recording -> Finished
  const handleStopRecording = async () => {
    try {
      // 1. Stop recording
      await audioRecorder.stop();
      setStatus('finished');

      const uri = audioRecorder.uri;
      console.log("Recording URI:", uri);

      if (!uri) return;

      // 2. WEB HANDLING
      if (Platform.OS === 'web') {
        const response = await fetch(uri);
        const blob = await response.blob();
        
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          // The result is "data:audio/m4a;base64,....."
          // We split at the comma to get just the base64 part
          const base64data = reader.result.split(',')[1];
          console.log("Base64 Length (Web):", base64data.length);
        };
        return; // Exit early for Web
      }

      // 3. NATIVE HANDLING (Android/iOS)
      // Ensure Android URI is correct
      let correctUri = uri;
      if (Platform.OS === 'android' && !correctUri.startsWith('file://')) {
        correctUri = `file://${correctUri}`;
      }

      // Verify file exists
      const fileInfo = await FileSystem.getInfoAsync(correctUri);
      if (!fileInfo.exists) {
        console.error("File does not exist");
        return;
      }

      // Read as Base64
      const base64String = await FileSystem.readAsStringAsync(correctUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log("Base64 Length (Native):", base64String.length);

    } catch (error) {
      console.error("Failed to process recording:", error);
    }
  };
  
  // Transition: Finished -> Idle (Reset)
  const handleReset = () => {
    setStatus('idle');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Record Speech</Text>

      {status === 'recording' && (
        <Text style={styles.statusText}>Recording...</Text>
      )}

      {status === 'idle' && (
        <Button title="Record" onPress={handleStartRecording} />
      )}

      {status === 'recording' && (
        <Button title="Stop" onPress={handleStopRecording} color="red" />
      )}

      {status === 'finished' && (
        <View style={styles.buttonGroup}>
          <Button title="Save" onPress={handleReset} />
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