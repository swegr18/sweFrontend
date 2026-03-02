import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop, Text } from "react-native-svg"

export default function AnimatedGridBackground(){
  const [activeIndex, setActiveIndex] = useState(0);

  const SquareSVG = ({id, stopColor1, stopColor2, ...props }) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={50}
      height={50}
      fill="none"
      {...props}
    >
      <Path fill={`url(#${id})`} d="M0 0h50v50H0z" />
      <Defs>
        <RadialGradient
          id={id}
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(0 25 -25 0 25 25)"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stopColor={stopColor1} />
          <Stop offset={1} stopColor={stopColor2} />
        </RadialGradient>
      </Defs>
    </Svg>
  )

  const columns = 5;
  const rows = 8;
  const totalSquares = columns * rows;

  useEffect(() => {
    
    const interval = setInterval(() => {
      setActiveIndex((currentIndex) => {

        if (currentIndex == 5){
          return currentIndex + 3
        } 
        if (currentIndex == 10){
          return currentIndex + 3
        } 
        if (currentIndex == 25){
          return currentIndex + 3
        } 
        if (currentIndex == 30){
          return currentIndex + 3
        } 
        return (currentIndex + 1) % totalSquares;
      });
    }, 600); 

    // Cleanup the timer if the component unmounts
    return () => clearInterval(interval);
  }, [totalSquares]);

  const squares = Array.from({ length: totalSquares });

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {squares.map((_, index) => {
          const isActive = index === activeIndex;

          const activeInner = '#747474';  
          const activeOuter = '#565656';   
          
          const inactiveInner = '#303030'; 
          const inactiveOuter = '#1C1C1C'; 

          return (
            <View key={index} style={styles.squareWrapper}>
              <SquareSVG id={`gradient-${index}`}
                stopColor1={isActive ? activeInner : inactiveInner}
                stopColor2={isActive ? activeOuter : inactiveOuter}
              />
            </View>
          );
        })}
      </View>
    </View>
  );
};



const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 14,
    marginLeft: 13,
    paddingTop: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%' - 40, // 20 padding on each side
    gap: 14, 
  },
  squareWrapper: {
    width: 50,
    height: 50,
    shadowColor: '#FF004D',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 3, 
  }
});

