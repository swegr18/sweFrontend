import React, { useState, useEffect} from 'react'; 
import { Text, View, StyleSheet, Pressable} from 'react-native';

export default function WpmSpedometer() {
    
    // Currently a mock function until the backend is setup
    const [wpm, setWpm] = useState(0);

    useEffect(() => {
        // 2. Define the function to get data
        const fetchWPM = async () => {

            try {
                //const response = await fetch('http://127.0.0.1:8000/api/v1/');
                //const data = await response.json();
                const data = {"wpm":120}
                // 3. Update the state (this automatically updates the <Text>!)
                setWpm(data.wpm);

            } catch (err) {
                console.error("Cannot fetch WPM - deault set to 0", err);
                setWpm(0) // error value
            }
    };


        const interval = setInterval(fetchWPM, 3000);
        fetchWPM();

        return () => clearInterval(interval);
    }, []);

    return (
            <View style={styles.spedometerContainer}>
                <Text style={styles.title} id="wpmDisplayData">{wpm}</Text>

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
        height:"20%",
        backgroundColor: "green",

    }
});