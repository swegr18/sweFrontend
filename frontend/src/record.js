import React, { useState, useEffect, useRef} from 'react';
import { StyleSheet, Text, View, Button, Alert, Platform, Pressable, TouchableOpacity } from 'react-native';
import {
  useAudioRecorder,
  AudioModule,
  RecordingPresets,
} from 'expo-audio';
import RecordButton from './components/recordButton'; 
import * as FileSystem from 'expo-file-system/legacy';
import WpmSpedometer from './wpmSpedometer';
import { v4 as uuidv4 } from 'uuid';
import PostRecordScreen from './postRecordScreen';
import ContextModeSwitch from './components/contextModeSwitch';
import LiveWPMSwitch from './components/liveWPMSwitch';
export default function RecordScreen({status, setStatus, accessToken}) {

    // page and microphone states
    const [permissionResponse, setPermissionResponse] = useState(null);
    const [fileid, setFileid] = useState(null);

    const intervalRef = useRef(null);
    const sessionIdRef = useRef(null);
    const chunkIndexRef = useRef(0);
    const [latestChunkIdx, setLatestChunkIdx] = useState(-1);
    const [sessionId, setSessionId] = useState(null);
    const [context_mode, setContextMode] = useState("In-Person");
    const[live_mode, setLiveMode] = useState("On")


    // queue system
    const uploadQueueRef = useRef([]); // holds the pending chunks
    const isUploadingRef = useRef(false); // locks the queue while an upload is happening

    // audio Recorder Object
    const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
    
    // persmissions
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
    
    // recording functions --
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
        const sid = uuidv4();
        sessionIdRef.current = sid;
        setSessionId(sid);
        chunkIndexRef.current = 0;
        await audioRecorder.prepareToRecordAsync(RecordingPresets.HIGH_QUALITY);
        audioRecorder.record();
        
        setStatus('recording'); // update Status for Button change

        // set up cyclic calls for live sending
        intervalRef.current = setInterval(async () => {
          await cycleRecording()
        }, 5000);
      
      } catch (error) {
      console.error("Failed to start recording:", error);
      }
    }

    
    const uploadChunk = async (uri, isFinal) => {
      if (!uri) return;

      //  reserve an index immediately (prevents duplicates if uploads overlap)
      const idx = chunkIndexRef.current++;
      try {
        const formData = new FormData();
        formData.append("session_id", sessionIdRef.current);
        formData.append("chunk_index", String(idx));
        formData.append("is_final", isFinal ? "true" : "false");
        formData.append("context_mode", String({context_mode}));

        // in Web
        if (Platform.OS === 'web') {
          const response = await fetch(uri);
          const blob = await response.blob();

          // check Blob Exists
          console.log("Web Blob created. Size:", blob.size, "bytes");
          formData.append('audio', blob, `chunk_${idx}.m4a`);
        } 
        // in Native
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

        // check Data Processing is fine
        console.log("Uploading chunk:", idx, "final:", isFinal);
        let id = uuidv4();
        setFileid(id);
        // send to Backend API
        const response = await fetch(`http://143.110.169.239:8000/api/v1/upload-audio?file_id=${id}`, {
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
  


    // queue system for sending data
    const processUploadQueue = async () => {
      // if we are already uploading, or the queue is empty, do nothing and wait.
      if (isUploadingRef.current || uploadQueueRef.current.length === 0) {
        return;
      }

      // 'lock' the queue
      isUploadingRef.current = true;

      // take the oldest chunk out of the queue
      const { uri, isFinal } = uploadQueueRef.current.shift();

      try {
        // wait for the upload to completely finish
        await uploadChunk(uri, isFinal);
      } finally {
        // once finished, unlock the queue
        isUploadingRef.current = false;
        // recursively check if there are more chunks waiting
        processUploadQueue();
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
            uploadQueueRef.current.push({ uri, isFinal: false });
            processUploadQueue();
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
              if (uri) {
              uploadQueueRef.current.push({ uri, isFinal: true });
              processUploadQueue(); 
          }
          }

      } catch (error) {
          console.error("Stop failed:", error);
      }
    };

    // Updates status back to idle post recording and save
    const handleReset = () => {
      setLiveMode("On")
      setContextMode("Onine")
      setStatus('idle');
    };  

    const isRecording = () => { //tells other files whether currently recording
      return status=='recording';
    }

    const handleModeChange = (newMode) => {
      setContextMode(newMode);
    };

    const handleLiveModeChange = (newMode) => {
      setLiveMode(newMode);
    };


   return (
            <> 
        
                {(status === 'idle' || status === 'recording' || status === 'nomicrophone') && (
                  <Text style={styles.title}>Record Speech</Text>                
                )}
        
                {status === 'idle' && (
                  <TouchableOpacity onPress={startRecording} style={styles.homeButton} accessibilityRole="button"  accessibilityLabel="Record">
                    <RecordButton width={60} height={60} />
                  </TouchableOpacity>
                )}

                {status === 'idle' && (
                  <View style={styles.switchGroup}>
                    <View style={styles.switchContainer}>
                      <Text style={styles.switchTitle}>Context Mode</Text>
                      <ContextModeSwitch onModeChange={handleModeChange}/>
                    </View>
                    
                    <View style={styles.switchContainer}>
                      <Text style={styles.switchTitle}>Live WPM</Text>
                      <LiveWPMSwitch onLiveModeChange={handleLiveModeChange}/>
                    </View>
                  </View>
                )}

                {status === 'nomicrophone' && (
                  <Button title="Record" onPress={stopRecording} color='green' style={styles.homeButton} />
                )}
        
                {status === 'nomicrophone' && (
                  <Text style={styles.statusText}>Microphone permission denied</Text>
                )}

                {(status === 'recording' || status === 'finishing') && (
                    <WpmSpedometer
                        sessionId={sessionId}
                        onStop={stopRecording}
                        isVisible={status === 'recording'}
                        onHidden={() => setStatus('finished')}
                        liveWPM={live_mode}
                    />
                )}

                {(status === 'finished' || status === 'finishing') && (

                  <PostRecordScreen handleReset={handleReset} accessToken={accessToken} fileid={fileid}/>
                )}
                
            </> 
   );
}

const styles = StyleSheet.create({

  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
    color: 'white',
    fontFamily: "Exo_700Bold"
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
  },
  switchGroup:{
    flexDirection: 'row', 
    alignItems: 'center',
    gap: 20, 
    marginTop: 50,

  },
  switchContainer:{
    alignItems:'center',
  },
  switchTitle: {
    color: 'white',
    fontFamily: "Exo_700Bold"
  }

});