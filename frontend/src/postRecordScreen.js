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
                    <StatCard title="Duration" value={"0"}/>
                    <StatCard title="Average Volume" value={"0"}/>
                    <StatCard title="Average Pitch" value={"0"}/>
                    <StatCard title="WPM" value={"0"}/>
                  </>
                  : null}
            
                  {!metrics ? (
                   <Text style={styles.infoText}>Loading...</Text>
                  ) : (
                    <View>

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
