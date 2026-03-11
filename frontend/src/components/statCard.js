import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function StatCard({ title, value, style, valueSize, oneLine=false}) {
  
  return (
    <View style={[styles.card, style]}>
      <View style={oneLine ? styles.row : styles.column}>
        <Text style={styles.title}>{title}</Text>
        
        <View style={styles.valueContainer}>
          <Text style={[styles.value, {fontSize: valueSize}]}>{value}</Text>   
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#313639',
    padding: 10,
    borderRadius: 1,
    borderColor: '#E00043',
    boxShadow: 'inset 0px 0px 20px #E00043',
    borderWidth: 3,
    width: 100,
    height:73,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: 'gray',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: 'Exo_700Bold',

},
  valueContainer: {
    marginTop: 0,
    flexDirection: 'row',
    alignItems: 'baseline',
    width: 'auto',
    justifyContent: 'flex-end',
    paddingBottom: 5,

  },
  value: {
    fontSize: 36,
    fontWeight: '800',
    color: 'white',
    fontFamily: 'Exo_700Bold',
    letterSpacing: -0.5,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  column: {
    flexDirection: "column",
  },
});

