import React, { useState } from 'react'; 
import { Text, View, StyleSheet, Pressable, Button, TextInput } from 'react-native';
import { FontAwesome6, AntDesign } from '@expo/vector-icons';

export default function LogonPopup() {
    const [profilePopup, setProfilePopup] = useState(false);
    const [signInStatus, setSignInStatus] = useState('SignedOut');

    // Open profile pop-up
    const openProfile = () => {
        setProfilePopup(true);
    };

    // Close profile pop-up
    const closeProfile = () => {
        setProfilePopup(false);
    };

    const signOut = () => {
        setSignInStatus('SignedOut');
    };

    const signIn = () => {
        setSignInStatus('SignedIn');
    };

    const startCreateAccount = () => {
        setSignInStatus('CreatingAccount');
    };

    const createAccount = () => {
        setSignInStatus('SignedIn');
    }

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
                    <Pressable style={styles.closeButton}
                        onPress={closeProfile} 
                        accessibilityRole='button' 
                        accessibilityLabel='ClosePopup'
                    >
                        <AntDesign name="close" size={24} color="red" />
                    </Pressable>

                    {signInStatus==='SignedIn' &&  (
                        <View>
                            <Text>Hello, Ben</Text>
                            <Button title="Sign Out" accessibilityLabel='LogOut' onPress={signOut}/>
                        </View>
                    )}

                    {signInStatus==='SignedOut' && (
                        <View>
                            <View accessibilityLabel='LoginForm'>
                                <TextInput placeholder='Email Address'/>
                                <TextInput placeholder='Password'/>
                                <Button title='Submit' accessibilityLabel='LoginSubmit' onPress={signIn}/>
                            </View>
                            <Text>Don't have an account?</Text>
                            <Button title='Create Account' accessibilityLabel='CreateAccountButton' onPress={startCreateAccount} />
                        </View>
                    )}

                    {signInStatus==='CreatingAccount' &&(
                        <View>
                            <View accessibilityLabel='CreateAccountForm'>
                                <TextInput placeholder='Email Address'/>
                                <TextInput placeholder='First Name'/>
                                <TextInput placeholder='Password'/>
                                <TextInput placeholder='Confirm Password'/>
                                <Button title='Submit' accessibilityLabel='CreateAccountSubmit' onPress={createAccount}/>
                            </View>
                            <Text>Already have an account?</Text>
                            <Button title='Log In' accessibilityLabel='LogInButton' onPress={signOut} />
                        </View>
                    )}

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
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
    popup: {
        height: "25%",
        backgroundColor: '#ff0',
        alignItems: 'center',
        position: "absolute",
        top: 10,
        width: "95%",
        alignSelf: 'center', 
        paddingTop: 10,
        zIndex: 10,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        fontWeight: 'bold',
    },
    signOutButton: {
        backgroundColor: "#6200ff",
        width: "10%",
        height: "5%",
        fontSize: 10
    }
});