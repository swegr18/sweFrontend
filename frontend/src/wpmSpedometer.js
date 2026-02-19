import React, { useState, useEffect, useRef } from 'react'; 
import { Text, View, StyleSheet, Button, Animated } from 'react-native';
import AnimatedWave from './wpmWave'


export default function WpmSpedometer({ sessionId, chunkIndex, onStop, isVisible, onHidden }) {
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


    // Currently a mock function until the backend is setup
    const [wpm, setWpm] = useState(0);

    useEffect(() => {
        let isActive = true;

        const fetchWPM = async () => {
            try {
                // Don't fetch until we have a session and at least one chunk index
                if (!sessionId || chunkIndex == null || chunkIndex < 0) {
                    return;
                }

                const url = `http://127.0.0.1:8000/api/v1/live-wpm?session_id=${encodeURIComponent(sessionId)}&chunk_index=${encodeURIComponent(String(chunkIndex))}`;
                const response = await fetch(url);
                const data = await response.json();

                if (isActive && response.ok && data && data.wpm != null) {
                    setWpm(data.wpm);
                }
            } catch (err) {

                if (isActive) {
                //console.error("Cannot fetch WPM - deault set to 0");
                setWpm(0)
                }


            }
        };

        const interval = setInterval(fetchWPM, 2500);
        fetchWPM();

        return () => {
            isActive = false;
            clearInterval(interval);
        }
    }, [sessionId, chunkIndex]);

    return (

        <Animated.View style={[styles.speechContainer, {transform: [{translateY: slideAnim}]}]}>        
            <AnimatedWave />
            <View style={styles.spedometerContainer}>
                <Text style={styles.wpmText}>{wpm} WPM</Text>
                <Text style={styles.labelText}>Recording...</Text>
            </View>
            <Button  style={styles.stopButton} title="Stop" onPress={onStop} />
        </Animated.View>

    );
} 

const styles = StyleSheet.create({


    spedometerContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 10,
        borderColor: 'white', 
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#2e6f40', 
        marginBottom: 20,
    },
    speechContainer: {
        position: 'absolute', 
        bottom: 0,           
        left: 0,
        right: 0,             
        
        height: '70%',       
        width: '100%',        
        
        backgroundColor: '#2e6f40', 
        
        // Center the circle inside the green box
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1, 
    },
    wpmText: {
        color: 'white',
        fontFamily: 'Trebuchet MS'
    },
    labelText: {
        color: 'white',
        fontFamily: 'Trebuchet MS'
    },
    stopButton: {
        color: 'white'
    }
});