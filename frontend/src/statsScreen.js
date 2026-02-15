import React, { useState, useEffect } from 'react'; 
import { Text, View, StyleSheet, Pressable } from 'react-native';

export default function StatsScreen({ onBack }) {

  const [metrics, setMetrics] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/api/v1/metrics/latest")
      .then(async (res) => {
        const data = await res.json();
        console.log("metrics response:", data);   // <-- LOOK AT THIS IN CONSOLE
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
    <View>
      <Text style={styles.title}>Stats</Text>

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

      <Pressable 
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole='button' 
        accessibilityLabel='statsButton'
      >
        <Text>Go Back</Text>
      </Pressable>
    </View>
  );
} 

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 20,
    fontWeight: 'bold',
  },
  backButton: {}
});