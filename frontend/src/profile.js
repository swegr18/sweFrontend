import React, { useState } from 'react'; 
import { Text, View, StyleSheet, Pressable, TextInput } from 'react-native';
import { FontAwesome6, AntDesign } from '@expo/vector-icons';

export default function LogonPopup() {
    const [profilePopup, setProfilePopup] = useState(false);
    const [signInStatus, setSignInStatus] = useState('SignedOut');

    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [errorMessage, setErrorMessage] = useState(' ');

    // Open profile pop-up
    const openProfile = () => {
        setProfilePopup(true);
    };

    // Close profile pop-up
    const closeProfile = () => {
        setProfilePopup(false);
    };

    const signOut = () => {
        setErrorMessage(' ');
        setSignInStatus('SignedOut');
    };

    const signIn = () => {
        if(email=="" || password==""){
            setErrorMessage('Please enter an email address and password');
        }
        else{
            setErrorMessage(' ');
            setSignInStatus('SignedIn');
        }
        setPassword('');
    };

    const startCreateAccount = () => {
        setErrorMessage(' ');
        setSignInStatus('CreatingAccount');
    };

    const createAccount = () => {
        if(email=="" || password=="" || name==""){
            setErrorMessage('Please enter an email address, first name and password');
        }
        else if(password != confirmPassword){
            setErrorMessage('Passwords must match');
        }
        else if(passwordStrength(password) != ""){
            setErrorMessage(passwordStrength(password));
        }
        else{
            setSignInStatus('SignedIn');
            setPassword('');
        }
    }

    const emailIsValid = (emailToCheck) => {
        return true;
    }

    const passwordStrength = (passwordToCheck) => {
        if(passwordToCheck.length < 7){
            return "Password must be at least 7 characters";
        }

        if(passwordToCheck == passwordToCheck.toUpperCase()){
            return "Password must contain at least one lower case character";
        }

        if(passwordToCheck == passwordToCheck.toLowerCase()){
            return "Password must contain at least one upper case character";
        }

        if(!/[ ! \" #$%&'()*+,-./:;<=>?@ \[ \\ \] ^_`{|}~ ]/.test(passwordToCheck)){
            return "Password must contain at least one special character";
        }
        
        const special = "!\"#$%&'()*+,-./:;<=>?@[ \\ ]^_`{|}~";
        let foundSpecial = false;
        let i = 0;
        while(!foundSpecial){
            if(i == special.length){
                return "Password must contain at least one special character";
            }
            else{
                if(passwordToCheck.includes(special[i])){
                    foundSpecial = true;
                }
                i++;
            }
        }

        if(! /\d/.test(passwordToCheck)){
            return "Password must contain at least one number";
        }

        return "";
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
                        <View style={styles.spread} >
                            <Text style={styles.subtitle}>Hello, Ben</Text>
                            <Pressable accessibilityRole='button' style={styles.button} accessibilityLabel='LogOut' onPress={signOut}>
                                <Text style={styles.buttonText}>Sign Out</Text>
                            </Pressable>
                        </View>
                    )}

                    {signInStatus==='SignedOut' && (
                        <View>
                            <View accessibilityLabel='LoginForm'>
                                <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder='Email Address'/>
                                <TextInput value={password} onChangeText={setPassword} style={styles.input} placeholder='Password'/>
                                <Text style={styles.errorMessage}>{errorMessage}</Text>
                                <Pressable accessibilityRole='button' style={styles.button} accessibilityLabel='LoginSubmit' onPress={signIn}>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </Pressable>
                            </View>
                            <View style={styles.oneline}>
                                <Text>Don't have an account? </Text>
                                <Pressable accessibilityRole='button'  accessibilityLabel='CreateAccountButton' onPress={startCreateAccount} >
                                    <Text style={styles.hyperlink}>Create one</Text>
                                </Pressable>
                            </View>
                        </View>
                    )}

                    {signInStatus==='CreatingAccount' &&(
                        <View>
                            <View accessibilityLabel='CreateAccountForm'>
                                <TextInput value={email} onChangeText={setEmail} style={styles.input} placeholder='Email Address'/>
                                <TextInput value={name} onChangeText={setName} style={styles.input} placeholder='First Name'/>
                                <TextInput value={password} onChangeText={setPassword} style={styles.input} placeholder='Password'/>
                                <TextInput value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} placeholder='Confirm Password'/>
                                <Text style={styles.errorMessage}>{errorMessage}</Text>
                                <Pressable accessibilityRole='button' style={styles.button} accessibilityLabel='CreateAccountSubmit' onPress={createAccount}>
                                    <Text style={styles.buttonText}>Submit</Text>
                                </Pressable>
                            </View>
                            <View style={styles.oneline}>
                                <Text>Already have an account? </Text>
                                <Pressable accessibilityRole='button' accessibilityLabel='LogInButton' onPress={signOut} >
                                    <Text style={styles.hyperlink}>Log In</Text>
                                </Pressable>
                            </View>
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
        height: "40%",
        backgroundColor: '#ff0',
        alignItems: 'center',
        position: "absolute",
        top: 10,
        width: "95%",
        alignSelf: 'center', 
        paddingTop: 10,
        zIndex: 10,
        borderRadius: "8px",
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
        fontWeight: 'bold',
    },
    subtitle: {
        fontSize: 20,
        alignSelf: "center",
    },
    button: {
        backgroundColor: "#2600ff",
        width: "100px",
        height: "25px",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        borderRadius: 5,
    },
    buttonText: {
        color: "#ffffff",
        fontSize: "15px",
    },
    input: {
        backgroundColor: "#cfc4c4",
        lineHeight: 22,
        padding: 3,
        marginBottom: 3,
        borderRadius: 5,
        width: 200,
        alignSelf: 'center',
    },
    errorMessage:{
        color: "#ff0000",
        alignSelf: 'center',
        fontSize: 13
    },
    hyperlink: {
        color: "#006aff",
        textDecorationLine: "underline",
    },
    oneline: {
        flexDirection: "row",
        alignSelf: 'center',
    },
    spread: {
        flex: 1,
        justifyContent: "space-between",
        marginTop: 20,
        marginBottom: 40,
    },
});