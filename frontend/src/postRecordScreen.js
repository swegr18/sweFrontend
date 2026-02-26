import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Button, Easing, Dimensions, TextInput } from 'react-native';
import StatCard from './statCard.js'
export default function PostRecordScreen({handleReset}){
    

      const [metrics, setMetrics] = useState(null);
      const [error, setError] = useState("");
      const [speechName, setSpeechName] = useState(null);
    
      useEffect(() => {
        fetch("http://localhost:8000/api/v1/metrics/latest")
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
      

      const submitPostToBackend = async () => {
        /// some code here
        console.log("send name to backend")
      }
      const handleSave = async () => {
        try {
          await submitPostToBackend(); 

          handleReset(); 

        } catch (error) { 
          // failed to send details
          console.error("Error submitting post: ", error);
          alert("There was an issue saving to the server.");
          handleReset();
        }
      };


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
              <TextInput testID="nameButton" style={styles.speechInput}value={speechName} onChangeText={setSpeechName} placeholder={"Name..."}></TextInput>
              <View style={{height: 10}} /> 
              <Button title="Save" onPress={handleSave} color='green'/>
              <View style={{height: 10}} /> 
              <Button title="Delete" onPress={handleReset} color="black" />
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
    }

});
