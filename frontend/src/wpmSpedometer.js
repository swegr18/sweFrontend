import React, { useState, useEffect } from 'react'; 
import { Text, View, StyleSheet } from 'react-native';

export default function WpmSpedometer({ sessionId, chunkIndex }) {
        
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
                console.error("Cannot fetch WPM - deault set to 0");
                setWpm(0)
                }
            }
        };

        const interval = setInterval(fetchWPM, 2000);
        fetchWPM();

        return () => {
            isActive = false;
            clearInterval(interval);
        }
    }, [sessionId, chunkIndex]);

    return (

        <View style={styles.spedometerContainer}>
            <Text style={styles.wpmText}>{wpm} WPM</Text>
            <Text style={styles.labelText}>Recording...</Text>
        </View>
    );
} 

const styles = StyleSheet.create({


     title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    spedometerContainer: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 10,
        borderColor: 'green', // Simple color logic
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    }
});