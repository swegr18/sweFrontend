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
  // Status of the recording page - Idle, Recording, Finished
  const [status, setStatus] = useState('idle');
  const [permissionResponse, setPermissionResponse] = useState(null);


  // Audio Recorder Object
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

  // Persmissions
  useEffect(() => {
    (async () => {
      const response = await AudioModule.requestRecordingPermissionsAsync();
      setPermissionResponse(response);
    })();
  }, []);

  // Start Recording
  const handleStartRecording = async () => {
    try {
      if (permissionResponse?.status !== 'granted') {
        const response = await AudioModule.requestRecordingPermissionsAsync();
        setPermissionResponse(response);
        if (response.status !== 'granted') {
          setStatus('nomicrophone')
          return;
        }
      }

      await audioRecorder.prepareToRecordAsync(RecordingPresets.HIGH_QUALITY);
      audioRecorder.record();
      
      setStatus('recording'); // Update Status for Button change
    } catch (error) {
      console.error("Failed to start recording:", error);
    }
  };


  // End Recording
  const handleStopRecording = async () => {
  try {
    
    await audioRecorder.stop();
    setStatus('finished'); // Update Status for button changes
    
    const uri = audioRecorder.uri;
    console.log("Recording saved at:", uri);
    if (!uri) return;


    // TEST - SAVE TO COMPUTER - Will be deleted later after backend is hooked up
    if (Platform.OS === 'web') {
      await saveToComputer(uri);
    } else {
      await shareFile(uri);
    }

    const formData = new FormData();

    // In Web
    if (Platform.OS === 'web') {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      // Check Blob Exists
      console.log("Web Blob created. Size:", blob.size, "bytes");
      formData.append('file', blob, 'recording.m4a'); // Create data to send
    } 
    // In Native
    else {
      const fileUri = Platform.OS === 'android' && !uri.startsWith('file://') 
                      ? `file://${uri}` 
                      : uri;

      formData.append('file', {
        uri: fileUri,
        type: 'audio/m4a',
        name: 'recording.m4a'
      }); 
    }
    
    // Check Data Processing is fine
    console.log("Content (formData):", formData);

    // Send to Backend API
    const response = await fetch('http://localhost:8000/api/v1/upload-audio', {
      method: 'POST',
      body: formData,
    });
    const result = await response.text(); 
    console.log("Backend Server Response:", result);
    

  } catch (error) {
    console.error("Upload failed:", error);
  }
};


// TESTING - checking audio is working locally
const saveToComputer = async (uri) => {
  if (Platform.OS === 'web') {
    const response = await fetch(uri);
    const blob = await response.blob();
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = 'my-recording.m4a'; 
    document.body.appendChild(link);
    link.click(); // Trigger the download
    
    // Clean up
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  }
};

  
  // Updates status back to idle post recording and save
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

      {status === 'nomicrophone' && (
        <Button title="Record" onPress={handleStartRecording} />
      )}

      {status === 'nomicrophone' && (
        <Text style={styles.statusText}>Microphone permission denied</Text>
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