import React, { useEffect, useRef, useState } from 'react';
import { View, Text, StyleSheet, Animated, Button, Easing, Dimensions } from 'react-native';

export default function PostRecordScreen(){
    

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
            
                  {error ? <Text>{error}</Text> : null}
            
                  {!metrics ? (
                    <Text>Loading...</Text>
                  ) : (
                    <View>
                      <Text>Duration: {String(metrics.duration)} s</Text>
                      <Text>Average Volume: {String(metrics.avg_volume_dbfs)} dBFS</Text>
                      <Text>Average Pitch: {String(metrics.avg_pitch_hz)} Hz</Text>
                      <Text>WPM: {String(metrics.wpm)}</Text>
                    </View>
                  )}
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        height: '50%',
        width: '70%',
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

