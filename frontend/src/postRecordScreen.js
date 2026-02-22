import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Button, Easing, Dimensions } from 'react-native';
import StatCard from './statCard.js'
export default function PostRecordScreen({handleReset}){
    

    const [metrics, setMetrics] = useState(null);
      const [error, setError] = useState("");
    
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


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Speech Statistics</Text>
            
                  {error ? 
                  <>
                    <Text style={styles.infoText}>{error}</Text>
                    <View style={styles.cardContainer}>
                      <StatCard title="Duration" value={"0"}/>
                      <StatCard title="Volume" value={"0"}/>
                      <StatCard title="Pitch" value={"0"}/>
                      <StatCard title="WPM" value={"0"}/>
                    </View>
                  </>
                  : null}
            
                  {!metrics ? (
                    <>
                   <Text style={styles.loadingText}>Loading...</Text>
                   <View style={styles.cardContainer}>
                      <StatCard title="Duration" value={"0"}/>
                      <StatCard title="Volume" value={"0"}/>
                      <StatCard title="Pitch" value={"0"}/>
                      <StatCard title="WPM" value={"0"}/>
                    </View>

                   </>
                  ) : (
                    <View>

                      <StatCard title="Duration" value={String(metrics.duration)}/>
                      <StatCard title="Volume" value={String(metrics.avg_volume_dbfs)}/>
                      <StatCard title="Pitch" value={String(metrics.avg_pitch_hz)}/>
                      <StatCard title="WPM" value={String(metrics.wpm)}/>

                    </View>
                  )}

            <View style={styles.buttonGroup}>
              <Button title="Save" onPress={handleReset} color='green'/>
              <View style={{height: 10}} /> 
              <Button title="Delete" onPress={handleReset} color="black" />
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        height: '70%',
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
      marginTop: 20,
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
      top: 80,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      width: '100%', 
      padding: 20, 
      gap: 5, 
    },

});
