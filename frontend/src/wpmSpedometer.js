import React, { useState, useEffect, useRef } from 'react'; 
import { Text, View, StyleSheet, Button, Animated, TouchableOpacity } from 'react-native';
import AnimatedGridBackground from './components/recordBackground';
import Svg, { Defs, RadialGradient, Stop, Rect } from 'react-native-svg';
import AnimatedWave from './wpmWave'

export default function WpmSpedometer({ sessionId, chunkIndex, onStop, isVisible, onHidden, liveWPM }) {
    // UI animations
    const slideAnim = useRef(new Animated.Value(700)).current; // start off-screen below

    useEffect(() => {
        if (isVisible) {
            Animated.spring(slideAnim, {
                toValue: 0,
                duration: 1000,
                useNativeDriver: false,
            }).start();
        } else {
            Animated.spring(slideAnim, {
                toValue: 700,
                duration: 1000,
                useNativeDriver: false,
            }).start(() => onHidden?.());
        }
    }, [isVisible]);


    const [wpm, setWpm] = useState(0);

    useEffect(() => {
        let isActive = true;

        const fetchWPM = async () => {
            try {
                // Don't fetch until we have a session and at least one chunk index
                if (!sessionId) {
                    return;
                }

                const url = `http://143.110.169.239:8000/api/v1/live-wpm?session_id=${encodeURIComponent(sessionId)}`;
                const response = await fetch(url);
                const data = await response.json();
                if (!isActive) return;
                if (response.ok && data?.ready && data?.running_wpm != null) {
                    
                    console.log("running_wpm");
                    setWpm(data.running_wpm);
                 }
            }   
            catch (err) {
                if (isActive) {
                //console.error("Cannot fetch WPM ",err);
                setWpm(0);
                }
            }
        };

        const interval = setInterval(fetchWPM, 5000);
        fetchWPM();
        
        return () => {
            isActive = false;
            clearInterval(interval);
        }
    }, [sessionId, chunkIndex]);

    // positioning maths for stop and wpm box
    const gap = 14;
    const squareSize = 50;

    // calculating sizes
    const wpmBoxWidth = (3 * squareSize) + (2 * gap);
    const wpmBoxHeight = squareSize + 2; // 1 square tall

    const stopBoxWidth = (3 * squareSize) + (2 * gap);
    const stopBoxHeight = (2 * squareSize) + (1 * gap) + 2; // 2 squares tall

    const GradientBox = ({ id, width, height, stopColor1, stopColor2 }) => (
        <Svg width="100%" height="100%" fill="none" viewBox={`0 0 ${width} ${height}`}>
            <Defs>
            <RadialGradient
                id={id}
                cx="50%"
                cy="50%"
                rx="50%"
                ry="50%"
                gradientUnits="userSpaceOnUse"
            >
                <Stop offset="0" stopColor={stopColor1} />
                <Stop offset="0.8" stopColor={stopColor2} />
            </RadialGradient>
            </Defs>
            <Rect x="0" y="0" width={width} height={height} fill={`url(#${id})`} rx="0" />
        </Svg>
        );


    const [durationSeconds, setDurationSeconds] = useState(0);

    useEffect(() => {
        const timerInterval = setInterval(() => {
            setDurationSeconds((prevSeconds) => prevSeconds + 1);
        }, 1000);
        
        // cleanup
        return () => clearInterval(timerInterval);
    }, []); 

    const formatDuration = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (

        <Animated.View style={[styles.speechContainer, { transform: [{ translateY: slideAnim }] }]}>        
            
            <View style={StyleSheet.absoluteFillObject}>
                <AnimatedGridBackground />
            </View>
            
            <AnimatedWave />            

            <View style={[styles.spedometerContainer, { width: wpmBoxWidth, height: wpmBoxHeight, transform: [{ translateY: -37 }] }]}>
                <View style={StyleSheet.absoluteFillObject}>
                    <GradientBox 
                        id="wpm-gradient"
                        width={wpmBoxWidth} 
                        height={wpmBoxHeight}
                        stopColor1="#00FF09" // inner gradient color
                        stopColor2="#00BF06" // outer gradient color
                    />
                </View>
                
                {(liveWPM === "On") && ( 
                    <>
                    <Text style={styles.wpmText}>{wpm} WPM</Text>
                    <Text style={styles.labelText}>Recording...</Text> 
                    </> )}

                {(liveWPM === "Off") && ( 
                    <>
                    <Text style={styles.wpmText}>N/A</Text>
                    <Text style={styles.labelText}>Recording...</Text> 
                    </> )}

            </View>


            <View style={{ height: gap }} />

            <View style={[styles.spedometerContainer, { width: wpmBoxWidth, height: wpmBoxHeight, transform: [{ translateY: -39 }] }]}>
                <View style={StyleSheet.absoluteFillObject}>
                    <GradientBox 
                        id="duration-gradient"
                        width={wpmBoxWidth} 
                        height={wpmBoxHeight}
                        stopColor1="#4A4A4A" // inner gradient color
                        stopColor2="#1A1A1A" // outer gradient color
                    />
                </View>
                <Text style={styles.wpmText}>{formatDuration(durationSeconds)} </Text>
                <Text style={styles.labelText}>Duration</Text>
            </View>

            <View style={{ height: squareSize + gap }} />

            <TouchableOpacity 
                accessibilityRole="button"
                accessibilityLabel="Stop"
                style={[styles.stopButton, { width: stopBoxWidth, height: stopBoxHeight, transform: [{ translateY: 37 }] }]} 
                onPress={onStop}
            >
                <View style={StyleSheet.absoluteFillObject}>
                    <GradientBox 
                        id="stop-gradient"
                        width={stopBoxWidth} 
                        height={stopBoxHeight}
                        stopColor1="#FF6090" // inner gradient color
                        stopColor2="#E00043" // outer gradient color
                    />
                </View>

                <Text style={styles.stopButtonText}>STOP</Text>
            </TouchableOpacity>

        </Animated.View>
    );
} 

const styles = StyleSheet.create({
    speechContainer: {
        position: 'absolute', 
        bottom: 0,           
        left: 0,
        right: 0,             
        height: '82%',       
        width: '100%',        
        alignItems: 'center',
        justifyContent: 'center', 
        zIndex: 1, 
        backgroundColor: 'black',

    },
    spedometerContainer: {
        borderRadius: 0,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.5,
        shadowRadius: 4,
        elevation: 5,
        overflow: 'hidden', 

    },
    wpmText: {
        color: 'white',
        fontFamily: 'Trebuchet MS',
        fontWeight: 'bold',
        fontSize: 18,
    },
    labelText: {
        color: 'white',
        fontFamily: 'Trebuchet MS',
        fontSize: 12,
    },
    stopButton: {
        backgroundColor: '#E00043',
        borderRadius: 0,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#E00043',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.6,
        shadowRadius: 8,
        elevation: 5,
    },
    stopButtonText: {
        color: 'white',
        fontFamily: 'Trebuchet MS',
        fontWeight: 'bold',
        fontSize: 20,
        letterSpacing: 1,
    }
});
