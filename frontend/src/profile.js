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
        setEmail('');
        setName('');
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
        else if(!emailIsValid(email)){
            setErrorMessage('Please enter a valid email address');
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
            setConfirmPassword('');
        }
    }

    const emailIsValid = (emailToCheck) => {
        let splitEmail = emailToCheck.split("@");
        if(splitEmail.length != 2){ //exactly one '@' sign
            return false;
        }
        for(let i = 0; i < splitEmail.length; i++){
            let section = splitEmail[i]
            if(/["(),:;<>@[\\\]]/.test(section)){ //email can't contain any of these special characters
                return false;
            }
            if(section.includes(" ")){ //email can't contain spaces
                return false;
            }
            if(section[0] == "." || section[section.length-1] == "."){ //email can't start or end with '.'
                return false;
            }
            if(section.includes("..")){ //email can't contain two consecutive '.'s
                return false;
            }
        }
        //additional checks specifically for the domain (after the @ sign)
        let splitDomain = splitEmail[1].split(".");
        if(splitDomain.length < 2){ //domain must contain at least one '.'
            return false;
        }
        if(/[!#$%&'*+/=?^_`{|}~]/.test(splitEmail[1])){ //only special character allowed is dash
            return false;
        }
        if(splitDomain[splitDomain.length - 1].length < 2){ //last portion of domain must be at least 2 characters
            return false;
        }
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

        if(!/[!\"#$%&'()*+,-./:;<=>?@\[\\\]^_`{|}~]/.test(passwordToCheck)){
            return "Password must contain at least one special character";
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
                    <FontAwesome6 name="circle-user" size={24} color="white" />
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
                                <TextInput value={password} onChangeText={setPassword} secureTextEntry={true} style={styles.input} placeholder='Password'/>
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
                                <TextInput value={password} onChangeText={setPassword} secureTextEntry={true} style={styles.input} placeholder='Password'/>
                                <TextInput value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={true} style={styles.input} placeholder='Confirm Password'/>
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