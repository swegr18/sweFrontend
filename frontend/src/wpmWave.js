import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Button, Easing, Dimensions } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const screenWidth = Dimensions.get('window').width;
const ITEM_WIDTH = screenWidth + 1;
const WAVE_HEIGHT = 50;
const WAVE_WIDTH = screenWidth * 2; // Make it wider than screen to allow scrolling

export default function AnimatedWave({ color = 'black' }){
    const translateX = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.loop(
            Animated.timing(translateX, {
                toValue: -screenWidth, // Move left by exactly one screen width
                duration: 2000, // Adjust speed (lower = faster)
                easing: Easing.linear,
                useNativeDriver: false,
            })
        ).start();
    }, []);

    return (
        <View style={{ 
            height: WAVE_HEIGHT, 
            width: -screenWidth*2, 
            position: 'absolute', 
            top: -50, // +1 fixes potential pixel gap line
            left: 0,
            overflow: 'hidden' // Ensure we don't see the wave sliding off-screen
        }}>
            <Animated.View
                style={{
                    flexDirection: 'row',
                    width: WAVE_WIDTH,
                    height: WAVE_HEIGHT,
                    transform: [{ translateX }],
                }}
            >
                
                <WaveSvg color={color} height={WAVE_HEIGHT} width={ITEM_WIDTH} />
                
                <View style={{ marginLeft: -1 }}>
                    <WaveSvg color={color} height={WAVE_HEIGHT} width={ITEM_WIDTH} />
                </View>

            </Animated.View>
        </View>
    );
};

// Helper component to keep the JSX clean
const WaveSvg = ({ color, height, width }) => (
    <Svg height={height} width={width} viewBox="0 0 1440 320" preserveAspectRatio="none">
        <Path
            fill={color}
            d="M0,64L48,96C96,128,192,192,288,192C384,192,480,128,576,96C672,64,768,64,864,96C960,128,1056,192,1152,192C1248,192,1344,128,1392,96L1440,64L1440,320L0,320Z"        />
    </Svg>
);