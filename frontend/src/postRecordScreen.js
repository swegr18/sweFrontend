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
            console.log("metrics fetch error:", err);
            setError(String(err.message || err));
          });
      }, []);


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Speech Statistics</Text>
            
                  {error ? <Text style={styles.infoText}>{error}</Text> : null}
            
                  {!metrics ? (
                   <Text style={styles.infoText}>Loading...</Text>
                  ) : (
                    <View>

                      <Text style={styles.infoText}>Duration: {String(metrics.duration)} s</Text>
                      <Text style={styles.infoText}>Average Volume: {String(metrics.avg_volume_dbfs)} dBFS</Text>
                      <Text style={styles.infoText}>Average Pitch: {String(metrics.avg_pitch_hz)} Hz</Text>
                      <Text style={styles.infoText}>WPM: {String(metrics.wpm)}</Text>
                    
                    <StatCard title="Duration" value={String(metrics.duration)}/>
                    <StatCard title="Average Volume" value={String(metrics.avg_volume_dbfs)}/>
                    <StatCard title="Average Pitch" value={String(metrics.avg_pitch_hz)}/>
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
        height: '50%',
        width: '70%',
        backgroundColor: '#313639',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonGroup: {
    marginTop: 20,
    width: '80%',
  },
  title: {
    color: 'white',
    fontFamily: 'Trebuchet MS'
  },
  infoText: {
    color: 'white',
    fontFamily: 'Trebuchet MS'
  }

});
