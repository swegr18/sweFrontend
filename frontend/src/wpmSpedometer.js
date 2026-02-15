import React, { useState, useEffect} from 'react'; 
import { Text, View, StyleSheet, Pressable} from 'react-native';

    export default function WpmSpedometer() {
        
        // Currently a mock function until the backend is setup
        const [wpm, setWpm] = useState(0);

        useEffect(() => {
            const fetchWPM = async () => {

                try {
                    const response = await fetch('http://127.0.0.1:8000/api/v1/');
                    const data = await response.json();
                    setWpm(data.wpm);

                } catch (err) {
                    console.error("Cannot fetch WPM - deault set to 0");
                    setWpm(0) // error value
                }
        };


            const interval = setInterval(fetchWPM, 3000);
            fetchWPM();

            return () => clearInterval(interval);
        }, []);

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