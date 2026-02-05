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


  const handleStopRecording = async () => {
  try {
    // 1. Stop the recorder
    await audioRecorder.stop();
    setStatus('finished');
    
    const uri = audioRecorder.uri;
    console.log("Recording saved at:", uri);
    if (!uri) return;


    

    // IF YOU WANT TO SAVE AUTOMATICALLY:
    if (Platform.OS === 'web') {
      await saveToComputer(uri);
    } else {
      await shareFile(uri);
    }

    const formData = new FormData();

    // 2. Prepare Data & Test Logs
    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // TEST LOG: Check the size of the blob
      console.log("Web Blob created. Size:", blob.size, "bytes");
      
      formData.append('file', blob, 'recording.m4a');
    } else {
      const fileUri = Platform.OS === 'android' && !uri.startsWith('file://') 
                      ? `file://${uri}` 
                      : uri;

      // TEST LOG: Verify file existence (if using expo-file-system)
      // const info = await FileSystem.getInfoAsync(fileUri);
      // console.log("Native File exists:", info.exists, "Size:", info.size);

      formData.append('file', {
        uri: fileUri,
        type: 'audio/m4a',
        name: 'recording.m4a'
      }); // Type cast for TS if needed
    }

    // 3. The "Mock" Backe  nd Test
    // Instead of hitting a real URL, we'll hit Webhook.site 
    // or just log that we are "ready" to send.
    
    console.log("Form Data is ready. Content:", formData);

    const response = await fetch('https://localhost:8000/api/v1', {
      method: 'POST',
      body: formData,
    });
    const result = await response.text(); 
    console.log("Mock Server Response:", result);
    

  } catch (error) {
    console.error("Process failed:", error);
  }
};


const saveToComputer = async (uri) => {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    // Create a link in the background
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = 'my-recording.m4a'; // The name of the file
    document.body.appendChild(link);
    link.click(); // Trigger the download
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
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