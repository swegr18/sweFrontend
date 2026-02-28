import React, { useState, useEffect } from 'react'; 
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

export default function StatsScreen({ onBack, accessToken }) {

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
    <View style={styles.statsScreen}>
      <Text style={styles.title}>Stats</Text>

      {accessToken && (
        <>
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
        </>
      )}
      {!accessToken && (
        <Text>Sign in or create an account to view full stats</Text>
      )}
      <Pressable 
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole='button' 
        accessibilityLabel='statsBackButton'
      >
        <AntDesign name="close" size={24} color="red" />
      </Pressable>
    </View>
  );
} 

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: 'bold',
    alignSelf: 'center'
  },
  backButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  statsScreen: {
    width: "100%",
    height: "100%",
    padding: "15px"
  }
});