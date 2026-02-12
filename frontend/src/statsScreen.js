import React, { useState } from 'react'; 
import { Text, View, StyleSheet, Pressable} from 'react-native';

export default function StatsScreen({ onBack }) {
    
    return (
            <View>
                <Text style={styles.title}>Stats</Text>

                <Pressable 
                    style={styles.backButton}
                    onPress={onBack}
                    accessibilityRole='button' 
                    accessibilityLabel='statsButton'
                    >
                        <Text>Go Back</Text>
                 
                </Pressable>


            </View>
    );
} 

const styles = StyleSheet.create({
     title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    backButton: {
        
    }
});