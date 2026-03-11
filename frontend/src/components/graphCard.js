import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LineChart } from "react-native-gifted-charts";

export default function GraphCard({ title, values, upperBound, lowerBound, step}) {
  
  if(!step){
    step = (upperBound - lowerBound) / 6;
    step = Math.ceil(step / 10) * 10;
    upperBound = lowerBound + (step * 6);
  }

  const len = values.length

  let spacing = 10;
  if(len > 1){
    spacing = 85 / (len-1);
  }

  let labelSpacing = 5;
  if(len > 1){
    if(len < 10){
      labelSpacing = 2;
    }
    else if(len < 25){
      labelSpacing = 5;
    }
    else if(len < 50){
      labelSpacing = 10;
    }
    else{
      labelSpacing = 20;
    }
  }

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{title}</Text>
       
      <LineChart accessible accessibilityRole="image" accessibilityLabel={`${title} Graph`}
        data={values.map((v, i) => ({ value: Number(v), label: (i % labelSpacing === 0 ? i.toString() : '') }))}
              
        minValue={lowerBound}
        maxValue={upperBound}
        yAxisOffset={lowerBound}

        stepValue={step}
         
        height={135}
        width={90}
          
        color="#4FD1C5"
        thickness={2}
        hideDataPoints={false}
        dataPointsColor="#4FD1C5"
        dataPointsRadius={2}

        spacing={spacing}
        initialSpacing={5}
        endSpacing={10}

        yAxisColor="rgb(255, 255, 255)"
        xAxisColor="rgb(255, 255, 255)"
        yAxisTextStyle={styles.graphlabels}

        yAxisLabelWidth={20}
        xAxisLabelTextStyle={styles.graphlabels}

        formatYLabel={(label) => Math.round(Number(label)).toString()}
        rulesColor="rgba(255,255,255,0.1)"
        rulesType="solid"

        disableScroll
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
    height: 200,
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
  text: {
    fontSize: 14,
    fontFamily: 'Exo_700Bold',
    color: 'white',
  },
  graphlabels: {
    fontSize: 10,
    fontFamily: 'Exo_700Bold',
    color: 'white',
    overflow: 'visible'
  },
});

