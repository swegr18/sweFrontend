import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import Svg, { Path, Defs, RadialGradient, Stop, Text } from "react-native-svg"

export default function LiveWPMSwitch({onLiveModeChange}) {
  const [activeSide, setActiveSide] = useState('On');


  const handlePress = (mode) => {
      setActiveSide(mode);
    
      if (onLiveModeChange) {
        onLiveModeChange(mode);
      }
    };

  const SwitchButton = ({ id, text, stopColor1 = "#606060", stopColor2 = "#555", ...props }) => (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      width={60}
      height={100}
      fill="none"
      {...props}
    >
      <Path fill={`url(#${id})`} d="M0 0h60v100H0z" />
      
      <Text
        x={4}
        y={52} 
        fill="black"
        fontSize="14"
        fontWeight="bold"
        textAnchor="right" 
        alignmentBaseline="middle"
        fontFamily="Exo_700Bold"
        transform="rotate(-90, 50, 50)" 
      >
        {text}
      </Text>
      <Defs>
        <RadialGradient
          id={id}
          cx={0}
          cy={0}
          r={1}
          gradientTransform="matrix(0 50 -30 0 30 50)"
          gradientUnits="userSpaceOnUse"
        >
          <Stop offset={0.058} stopColor={stopColor1} />
          <Stop offset={1} stopColor={stopColor2} />
        </RadialGradient>
      </Defs>
    </Svg>
  );

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        
        {/* On side */}
        <TouchableOpacity 
          style={[styles.button, activeSide === 'On' && styles.activeButton]}
          onPress={() => handlePress('On')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="wpmOn"
          accessibilityState={{ checked: activeSide === 'On' }}
        >
          <SwitchButton id="On" text="On" stopColor1={activeSide === 'On' ? "#FF5F8F" : "#828282"}
                        stopColor2={activeSide === 'On' ? "#E00043" : "#555"} />
        </TouchableOpacity>

        {/* Off side */}
        <TouchableOpacity 
          style={[styles.button, activeSide === 'Off' && styles.activeButton]}
          onPress={() => handlePress('Off')}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="wpmOff"
          accessibilityState={{ checked: activeSide === 'Off' }}
        >
          <SwitchButton id="Off" text="Off" stopColor1={activeSide === 'Off' ? "#FF5F8F" : "#828282"}
                        stopColor2={activeSide === 'Off' ? "#E00043" : "#555"} />
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'black', 
    borderRadius: 0,
    padding: 0,
  },
  button: {
    padding: 0,
    borderRadius: 0,
  },
  activeButton: {
    backgroundColor: 'black', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3, 
  },
});