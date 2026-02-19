import React, { useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Button, Alert, Platform, Pressable } from 'react-native';
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
} from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';
import WpmSpedometer from './wpmSpedometer';
import { v4 as uuidv4 } from 'uuid';
import PostRecordScreen from './postRecordScreen';

export default function RecordScreen() {

    // Page and Microphone States
    const [status, setStatus] = useState('idle');
    const [permissionResponse, setPermissionResponse] = useState(null);
    
    const intervalRef = useRef(null);
    const sessionIdRef = useRef(null);
    const chunkIndexRef = useRef(0);
    const [latestChunkIdx, setLatestChunkIdx] = useState(-1);
  
    // Audio Recorder Object
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    
    // Persmissions
    useEffect(() => {
        let isMounted = true;
        (async () => {
        const response = await AudioModule.requestRecordingPermissionsAsync();
        if (isMounted) {
            setPermissionResponse(response);
        }
        })();
      return () => { isMounted = false; }; // Cleanup
    }, []);
    
    // ----Start Recording-----
    const startRecording = async () => {
      try {
        if (permissionResponse?.status !== 'granted') {
          const response = await AudioModule.requestRecordingPermissionsAsync();
          setPermissionResponse(response);
          if (response.status !== 'granted') {
            setStatus('nomicrophone')
            return;
          }
        }
        sessionIdRef.current = uuidv4();
        chunkIndexRef.current = 0;
        await audioRecorder.prepareToRecordAsync(RecordingPresets.HIGH_QUALITY);
        audioRecorder.record();
        
        setStatus('recording'); // Update Status for Button change

        // Set up cyclic calls for live sending
        intervalRef.current = setInterval(async () => {
          await cycleRecording()
        }, 2000);
      
      } catch (error) {
      console.error("Failed to start recording:", error);
      }
    }

    const fetchLiveWpm = async (idx) => {
      try {
        const url = `http://localhost:8000/api/v1/live-wpm?session_id=${sessionIdRef.current}&chunk_index=${idx}`;
        const res = await fetch(url);
        const json = await res.json();
        if (res.ok && typeof json.wpm === 'number') {
          setLiveWpm(json.wpm);
        } else {
          setLiveWpm(0);
          console.log("Live WPM fetch failed:", res.status, json);
        }
      } catch (e) {
        setLiveWpm(0);
        console.log("Cannot fetch live WPM:", e?.message || e);
      }
    };

    const uploadChunk = async (uri, isFinal = false) => {
      if (!uri) return;

      //  reserve an index immediately (prevents duplicates if uploads overlap)
      const idx = chunkIndexRef.current++;

      try {
        const formData = new FormData();
        formData.append("session_id", sessionIdRef.current);
        formData.append("chunk_index", String(idx));
        formData.append("is_final", isFinal ? "true" : "false");

        // In Web
        if (Platform.OS === 'web') {
          const response = await fetch(uri);
          const blob = await response.blob();

          // Check Blob Exists
          console.log("Web Blob created. Size:", blob.size, "bytes");
          formData.append('audio', blob, `chunk_${idx}.m4a`);
        } 
        // In Native
        else {
          const fileUri = Platform.OS === 'android' && !uri.startsWith('file://') 
                          ? `file://${uri}` 
                          : uri;

          formData.append('audio', {
            uri: fileUri,
            type: 'audio/m4a',
            name: `chunk_${idx}.m4a`,
          });
        }

        // Check Data Processing is fine
        console.log("Uploading chunk:", idx, "final:", isFinal);

        // Send to Backend API
        const response = await fetch('http://localhost:8000/api/v1/upload-audio', {
          method: 'POST',
          body: formData,
        });

        const result = await response.text();
        console.log("Backend Server Response:", response.status, result);

        if (!response.ok) {
          throw new Error(`Upload failed: ${response.status} ${result}`);
        }
        setLatestChunkIdx(idx);
      } catch (err) {
        console.log("Cannot Upload Chunk:", err?.message || err, err);
      }
    };
  
    const cycleRecording = async () => {
      try {

        await audioRecorder.stop();
        
        const uri = audioRecorder.uri;
        
        await audioRecorder.prepareToRecordAsync(RecordingPresets.HIGH_QUALITY);
        audioRecorder.record();

        // send last 5 seconds to backend
        if (uri) {
            await uploadChunk(uri, false);
        }

      }  catch (error) {
        console.error("Error cycling recording:", error);
      }
    };


    


    const stopRecording = async () => {
      try {
          if (intervalRef.current) {
              clearInterval(intervalRef.current);
              intervalRef.current = null;
          }

          setStatus('finishing'); 


          if (audioRecorder.isRecording) {
              await audioRecorder.stop();
              const uri = audioRecorder.uri;
              uploadChunk(uri, true); 
          }

      } catch (error) {
          console.error("Stop failed:", error);
      }
    };

    // Updates status back to idle post recording and save
    const handleReset = () => {
      setStatus('idle');
    };  
    
   return (
            <> 
        
                <Text style={styles.title}>Record Speech</Text>
        
        
                {status === 'idle' && (
                  <Button title="Record" onPress={startRecording} color='green' style={styles.homeButton} />
                )}
        
                {status === 'nomicrophone' && (
                  <Button title="Record" onPress={stopRecording} color='green' style={styles.homeButton} />
                )}
        
                {status === 'nomicrophone' && (
                  <Text style={styles.statusText}>Microphone permission denied</Text>
                )}

                {(status === 'recording' || status === 'finishing') && (
                    <WpmSpedometer
                        sessionId={sessionIdRef.current}
                        chunkIndex={latestChunkIdx}
                        onStop={stopRecording}
                        isVisible={status === 'recording'}
                        onHidden={() => setStatus('finished')}
                    />
                )}

                {(status === 'finished' || status === 'finishing') && (

                  <PostRecordScreen/>
                )}
                
                {(status === 'finished' || status === 'finishing') && (

                  

                  <View style={styles.buttonGroup}>
                    <Button title="Save" onPress={handleReset} color='green'/>
                    <View style={{height: 10}} /> 
                    <Button title="Delete" onPress={handleReset} color="black" />
                  </View>
                )}
            </> 
   );
}

const styles = StyleSheet.create({

  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: 'white'
  },
  statusText: {
    fontSize: 18,
    marginBottom: 20,
    color: 'gray',
  },
  buttonGroup: {
    marginTop: 20,
    width: '80%',
  },
  homeButton: {
    borderRadius: 20,
  }

});