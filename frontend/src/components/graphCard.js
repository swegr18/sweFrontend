import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from "react-native-gifted-charts";

export default function GraphCard({ title, values, upperBound, lowerBound}) {
  
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
      
      <LineChart
            data={values.map(v => ({ value: Number(v) }))}
            minValue={lowerBound}
            maxValue={upperBound}
            stepValue={10}
        
            height={100}
            width={90}
        
            color="#4FD1C5"
            thickness={3}
            hideDataPoints={false}
            dataPointsColor="#4FD1C5"
            dataPointsRadius={3}
            spacing={15}
            initialSpacing={15}
            yAxisColor="rgb(255, 255, 255)"
            xAxisColor="rgb(255, 255, 255)"
            yAxisTextStyle={styles.graphlabels}
            yAxisLabelWidth={20}
            formatYLabel={(label) => Math.round(Number(label)).toString()}
            rulesColor="rgba(255,255,255,0.1)"
            rulesType="solid"
            isAnimated
      />   
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#313639',
    padding: 5,
    borderRadius: 1,
    borderColor: '#E00043',
    boxShadow: 'inset 0px 0px 20px #E00043',
    borderWidth: 3,
    width: "50%",
    height: 220,
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
  graphlabels: {
    fontSize: 10,
    fontFamily: 'Exo_700Bold',
    color: 'white',
  },
});

