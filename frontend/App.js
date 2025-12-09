import React, { useState } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native'; // Add this import at the top

export default function App() {
  const [recording, setRecording] = useState(null);      // Stores the recording object
  const [permissionResponse, requestPermission] = Audio.usePermissions();
  const [recordingUri, setRecordingUri] = useState(null); // Stores file path after stopping

  async function startRecording() {
    try {
      console.log('1. Requesting permissions..');
      
      // GUARD: Check if permissions are still loading
      if (!permissionResponse) {
          console.log('Permissions are loading, please try again.');
          return;
      }
      
      if (permissionResponse.status !== 'granted') {
        const response = await requestPermission();
        if (!response.granted) {
            alert('Permission needed!');
            return;
        }
      }

      console.log('2. Setting Audio Mode..');
      // IMPORTANT: These settings are crucial for keeping the mic open
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        shouldDuckAndroid: true,
        playThroughEarpieceAndroid: false,
        staysActiveInBackground: true,
      });

      console.log('3. Preparing Recorder..');
      // Create a new recording instance manually (safer than createAsync for debugging)
      const newRecording = new Audio.Recording();
      
      // Define options (enable metering here to fix the logging)
      const options = {
          ...Audio.RecordingOptionsPresets.HIGH_QUALITY,
          isMeteringEnabled: true, 
      };

      await newRecording.prepareToRecordAsync(options);

      // Set the status update listener (for the waves)
      newRecording.setOnRecordingStatusUpdate((status) => {
          if (status.isRecording && status.metering) {
               console.log(`Metering: ${status.metering}`);
          }
      });

      console.log('4. Starting Recording..');
      await newRecording.startAsync();

      // IF WE GET HERE, IT WORKED
      console.log('5. Success! Updating UI..');
      setRecording(newRecording);

    } catch (err) {
      // This will tell us exactly what broke
      console.error('Recording Error:', err);
      alert(`Failed to start: ${err.message}`);
    }
  }


  async function stopRecording() {
    console.log('Stopping recording..');
    setRecording(undefined);
    
    await recording.stopAndUnloadAsync();
    
    // This is the URI (file:// on mobile, blob: on web)
    const uri = recording.getURI(); 
    console.log('Recording stored at', uri);

    try {
      if (Platform.OS === 'web') {
        // --- WEB HANDLING ---
        // 1. Fetch the blob from the URL
        const response = await fetch(uri);
        const blob = await response.blob();

        // 2. Convert Blob to Base64
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          // The result looks like: "data:audio/webm;base64,UklGR..."
          // We split it to get just the Base64 data
          const base64Data = reader.result.split(',')[1];
          
          console.log('SUCCESS (Web)! Data length:', base64Data.length);
          // TODO: Send base64Data to your backend here
        };

      } else {
        // --- MOBILE HANDLING ---
        // standard Expo FileSystem approach
        const base64Data = await FileSystem.readAsStringAsync(uri, {
            encoding: FileSystem.EncodingType.Base64,
        });
        console.log('SUCCESS (Mobile)! Data length:', base64Data.length);
        // TODO: Send base64Data to your backend here
      }

    } catch (error) {
        console.error('Error extracting audio data:', error);
    }
  }

  const handleDelete = () => {
      setRecordingUri(null);
      // Logic to delete file from filesystem can go here
  };

  const handleSave = () => {
      console.log("Saved at:", recordingUri);
      // Logic to upload to server or move file goes here
      setRecordingUri(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Record Speech</Text>

      {/* Conditional Rendering based on State */}
      
      {recording ? (
        // STATE: Recording is Active
        <View>
             <Text style={styles.status}>Recording...</Text>
             <Button title="Stop" onPress={stopRecording} />
        </View>
      ) : recordingUri ? (
        // STATE: Recording Finished (Show Save/Delete)
        <View style={styles.controls}>
             <Button title="Save" onPress={handleSave} />
             <Button title="Delete" onPress={handleDelete} color="red" />
        </View>
      ) : (
        // STATE: Idle (Ready to Record)
        <Button title="Record" onPress={startRecording} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ecf0f1',
    padding: 10,
  },
  title: {
      fontSize: 24,
      marginBottom: 20,
      fontWeight: 'bold',
  },
  status: {
      marginBottom: 20,
      fontSize: 18,
      color: 'red',
      textAlign: 'center'
  },
  controls: {
      flexDirection: 'row',
      gap: 10
  }
});