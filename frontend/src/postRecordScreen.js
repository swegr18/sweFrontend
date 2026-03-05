import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Button, Easing, Dimensions, TextInput, Pressable } from 'react-native';
import StatCard from './statCard.js'
import { v4 as uuidv4 } from 'uuid';
export default function PostRecordScreen({handleReset, accessToken}){
    

      const [metrics, setMetrics] = useState(null); ``
      const [error, setError] = useState("");
      const [speechName, setSpeechName] = useState("");

      const [errorMessage, setErrorMessage] = useState(" ");
    
      useEffect(() => {
        fetch("http://143.110.169.239:8000/api/v1/metrics/latest")
          .then(async (res) => {
            const data = await res.json();
            console.log("metrics response:", data);  
            if (!res.ok) {
              throw new Error(data?.detail || data?.error || "Request failed");
            }
            return data;
          })
          .then(data => setMetrics(data))
          .catch(err => {
            setError(String(err.message || err));
          });
      }, []);
      

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
        const response2 = await fetch(`http://143.110.169.239:8000/api/v1/userdata?user_id=${userid}&filename=${speechName}`, {
            method: "POST",
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


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Speech Statistics</Text>
            
                  {error ? 
                  <>
                    <Text style={styles.infoText}>{error}</Text>
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
                    <View style={styles.cardContainer}>

                      <StatCard title="Duration" value={Number(metrics.duration).toPrecision(5)} style={{width: '100%'}}/>
                      <StatCard title="Volume" value={Number(metrics.avg_volume_dbfs).toPrecision(3)} style={{}}/>
                      <StatCard title="WPM" value={Number(metrics.wpm).toPrecision(3)} style={{}}/>
                      <StatCard title="Pitch" value={Number(metrics.avg_pitch_hz).toPrecision(5)} style={{width: '100%'}}/>


                    </View>
                  )}
                  
            <View style={styles.buttonGroup}>
              <TextInput testID="nameButton" style={styles.speechInput} value={speechName} onChangeText={setSpeechName} placeholder={"Name..."}></TextInput>
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
        width: '70%',
        backgroundColor: '#313639',
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#2e6f40',
        borderWidth: 3,
        borderRadius: 12,
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
      fontFamily: 'Trebuchet MS'
    },
    title: {
      position: 'absolute',
      top: 10,
      color: 'white',
      fontFamily: 'Trebuchet MS'
    },
    infoText: {
      position: 'absolute',
      top: 30,
      color: 'white',
      fontFamily: 'Trebuchet MS',
      color: 'red'
    },
    loadingText: {
      color: 'white',
      fontFamily: 'Trebuchet MS',
      position: 'absolute',
      top: 50,
    },
    cardContainer: {
      position: 'absolute',
      top: 70,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: '100%', 
      padding: 20, 
      gap: 5, 
    },
    speechInput: {
      borderColor: 'green',
      borderWidth: 2,
      backgroundColor: 'white',
      height: 34,
      fontFamily: 'Trebuchet MS',
    },
    errorMessage:{
        color: "#ff0000",
        alignSelf: 'center',
        fontSize: 12,
        fontFamily: 'Trebuchet MS'
    }

});
