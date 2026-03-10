import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Button, Easing, Dimensions, TextInput, Pressable } from 'react-native';
import StatCard from './components/statCard.js'
import { v4 as uuidv4 } from 'uuid';
export default function PostRecordScreen({handleReset, accessToken, fileid, isUploadFinished}){
    

      const [metrics, setMetrics] = useState(null); ``
      const [error, setError] = useState("");
      const [speechName, setSpeechName] = useState("");

      const [errorMessage, setErrorMessage] = useState(" ");
  
      useEffect(() => {
        if (!isUploadFinished) return;

        fetch("http://143.110.169.239:8000/api/v1/metrics/latest")
          .then(async (res) => {
            const data = await res.json();
            console.log("Raw API Response:", data); 
            if (!res.ok) {
              throw new Error(data?.detail || data?.error || "Request failed");
            }
            return data;
          })
          .then(data => setMetrics(data))
          .catch(err => {
            setError(String(err.message || err));
          });
          
      }, [isUploadFinished])


      // TODO: name to backend
      const submitPostToBackend = async () => {
        const response = await fetch("http://143.110.169.239:8000/api/v1/auth/me", {
            method: "GET",
            headers: {
            "Authorization": `Bearer ${accessToken}`,
            },
        });
        let resp = await response.json();
        let userid = resp.id;
        const url = `http://143.110.169.239:8000/api/v1/userdata?user_id=${userid}&filename=${encodeURIComponent(speechName)}&file_id=${fileid}`;
        const response2 = await fetch(url, {
          method: "POST",
          headers: {
          "Authorization": `Bearer ${accessToken}`,
          },
        });
        resp = await response2.json();
        return resp.ok;
      }


      const handleSave = async () => {
        let err = checkName(speechName)
        if(err == null){
          try {
            if(await submitPostToBackend()){
              handleReset(); 
            } 
            else{
              console.log("Error sending data");
            }
          } catch (error) { 
            // failed to send details
            console.error("Error submitting post: ", error);
            alert("There was an issue saving to the server.");
            handleReset();
          }
        }
        else{
          setErrorMessage(err);
        }
      };

      const checkName = (pName) => {
        if(pName == ""){
          return "Name cannot be empty";
        }
        else if(/[*?"<>|\\/:.]/.test(pName)){
            return "Name contains prohibited character";
        }
        return null
      }

      const COLORS = {
        green: '#00C853', // A nice vibrant green
        amber: '#FFC107', // A standard warning amber
        red: '#E00043'    // Your custom red
      };

      
      const getShadowStyle = (color) => ({
        boxShadow: `inset 0px 0px 50px ${color}`,
        borderColor: `${color}`
      });

      
      // duration colour
      const getDurationColor = (duration) => {
        return COLORS.green; 
      };

      // volume colour
      const getVolumeColor = (db) => {
        const v = Number(db);
        if (v >= -18 && v <= -6) return COLORS.green; 
        if ((v >= -24 && v < -18) || (v > -6 && v <= -3)) return COLORS.amber;
        return COLORS.red; 
      };

      // wpm colour
      const getWPMColor = (wpm) => {
        const w = Number(wpm);
        if (w >= 120 && w <= 160) return COLORS.green;
        if ((w >= 100 && w < 120) || (w > 160 && w <= 180)) return COLORS.amber;
        return COLORS.red; 
      };

      // pitch colour
      const getPitchColor = (pitch) => {
        const p = Number(pitch);
        if (p >= 80 && p <= 260) return COLORS.green;
        if ((p >= 60 && p < 80) || (p > 260 && p <= 300)) return COLORS.amber;
        return COLORS.red; 
      };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Speech Statistics</Text>
            
                  {error ? 
                  <>
                  <Text style={styles.loadingText}>Failed to fetch</Text>
                    <View style={styles.cardContainer}>
                      <StatCard title="Duration" value={Number(0.000).toPrecision(5)} style={{width: '200'}}/>
                      <StatCard title="Volume" value={Number(0.000).toPrecision(3)} style={{}}/>
                      <StatCard title="WPM" value={Number(0.000).toPrecision(3)} style={{}}/>
                      <StatCard title="Pitch" value={Number(0.000).toPrecision(5)} style={{width: '100%'}}/>

                    </View>
                  </>
                  : null}
            
                  {!metrics ? (
                    <>
                   <Text style={styles.loadingText}>Loading...</Text>
                   <View style={styles.cardContainer}>
                      <StatCard title="Duration" value={Number(0.000).toPrecision(5)} style={{width: '100%'}}/>
                      <StatCard title="Volume" value={Number(0.000).toPrecision(3)} style={{}}/>
                      <StatCard title="WPM" value={Number(0.000).toPrecision(3)} style={{}}/>
                      <StatCard title="Pitch" value={Number(0.000).toPrecision(5)} style={{width: '100%'}}/>

                    </View>

                   </>
                  ) : (
                    <>

                    <Text style={styles.loadingText}>Metrics Calculated </Text>
                    <View style={styles.cardContainer}>
                      
                      <StatCard title="Duration (s)" value={Number(metrics.duration).toPrecision(5)} style={{width: '100%', ...getShadowStyle(getDurationColor(metrics.duration))}}/>
                      <StatCard title="Volume (db)" value={Number(metrics.avg_volume_dbfs).toPrecision(3)} style={{width: '52%', fontSize: 10, ...getShadowStyle(getVolumeColor(metrics.avg_volume_dbfs))}}/>
                      <StatCard title="WPM" value={Number(metrics.wpm).toPrecision(3)} style={{width: '45%', ...getShadowStyle(getWPMColor(metrics.wpm))}}/>
                      <StatCard title="Pitch (Hz)" value={Number(metrics.avg_pitch_hz).toPrecision(5)} style={{width: '100%', ...getShadowStyle(getPitchColor(metrics.avg_pitch_hz))}}/>


                    </View>
                    </>
                  )}
                  
            <View style={styles.buttonGroup}>
              <TextInput testID="nameButton" style={styles.speechInput} value={speechName} onChangeText={setSpeechName} placeholder={" Name..."}></TextInput>
              <Text style={styles.errorMessage}>{errorMessage}</Text>
              {accessToken !== null ? ( //user is signed in
                <Pressable accessibilityRole="button" accessibilityLabel="Save" onPress={handleSave} style={styles.saveButton}>
                  <Text style={styles.buttonText}>SAVE</Text>
                </Pressable>
              ) : (
                  <Pressable accessibilityRole="button" accessibilityLabel="Save" style={styles.cantSaveButton}>
                  <Text style={styles.buttonText}>LOG IN TO SAVE STATS</Text>
                </Pressable>
              )}
              <View style={{height: 10}} /> 
              <Pressable accessibilityRole="button" accessibilityLabel="Delete" onPress={handleReset} style={styles.deleteButton}>
                <Text style={styles.buttonText}>DELETE</Text>
              </Pressable>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        height: '75%',
        width: '80%',
        backgroundColor: '#313639',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: 'red',
        borderWidth: 3,
        borderRadius: 12,
        boxShadow: 'inset 0px 0px 50px #E00043',
        fontFamily: "Exo_700Bold"


    },
    buttonGroup: {
      position: 'absolute',
      bottom: 30,
      marginTop: 30,
      width: '80%',
    },
    saveButton: {
      backgroundColor: 'green',
      justifyContent: 'center',
      height: '34px'
    },
    cantSaveButton: {
      backgroundColor: 'grey',
      justifyContent: 'center',
      height: '34px'
    },
    deleteButton: {
      backgroundColor: 'black',
      justifyContent: 'center',
      height: '34px'
    },
    buttonText:{
      alignSelf: 'center',
      color: 'white',
      fontFamily: 'Exo_700Bold'
    },
    title: {
      position: 'absolute',
      top: 10,
      color: 'white',
      fontFamily: 'Exo_700Bold'
    },
    infoText: {
      position: 'absolute',
      top: 30,
      color: 'white',
      fontFamily: 'Exo_700Bold',
      color: 'red'
    },
    loadingText: {
      color: 'white',
      fontFamily: 'Exo_700Bold',
      position: 'absolute',
      top: 40,
    },
    cardContainer: {
      position: 'absolute',
      top: 50,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: '100%', 
      padding: 20, 
      gap: 5, 
    },
    speechInput: {
      borderColor: '#ff0042',
      backgroundColor: '#313639',
      borderWidth: 2,
      height: 34,
      width:'100%',
      fontFamily: 'Exo_700Bold',
      color: 'white',
    },
    errorMessage:{
        color: "#ff0000",
        alignSelf: 'center',
        fontSize: 12,
        fontFamily: 'Exo_700Bold'
    }

});
