import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatCard({ title, value}) {
  
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>   
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 12,
    borderColor: '#2e6f40',
    borderWidth: 3,
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2e6f40',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Trebuchet MS',

},
  valueContainer: {
    marginTop: 5,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 36,
    fontWeight: '800',
    color: '#111827',
    fontFamily: 'Trebuchet MS',
    letterSpacing: -0.5,
  },
});

