import React, { useState } from 'react'; 
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { FontAwesome6, AntDesign } from '@expo/vector-icons';

export default function LogonPopup() {
    const [profilePopup, setProfilePopup] = useState(false);

    // Open profile pop-up
    const openProfile = () => {
        setProfilePopup(true);
    };

    // Close profile pop-up
    const closeProfile = () => {
        setProfilePopup(false);
    };

    return (

        <> 
            {!profilePopup && (
                <Pressable 
                    style={styles.profileButton} 
                    onPress={openProfile} 
                    accessibilityRole='button' 
                    accessibilityLabel='ProfileButton'
                >
                    <FontAwesome6 name="circle-user" size={24} color="black" />
                </Pressable>
            )}

            {profilePopup && (
                <View style={styles.popup}>
                    <Text style={styles.title}>Profile</Text>
                    <Pressable 
                        onPress={closeProfile} 
                        accessibilityRole='button' 
                        accessibilityLabel='ClosePopup'
                    >
                        <AntDesign name="close" size={24} color="red" />
                    </Pressable>
                </View>
            )}
        </>
    );
} 

const styles = StyleSheet.create({
    profileButton: {
        position: 'absolute',
        top: 20,
        right: 20,
    },
    popup: {
        height: "20%",
        backgroundColor: '#ff0',
        alignItems: 'center',
        position: "absolute",
        top: 20,
        width: "80%",
        alignSelf: 'center', 
        paddingTop: 20,
        zIndex: 10,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    }
});