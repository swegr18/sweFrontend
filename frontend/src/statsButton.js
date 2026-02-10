import React, { useState } from 'react'; 
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { FontAwesome6, AntDesign } from '@expo/vector-icons';

export default function StatsButton({ onShowNewScreen }) {


   return (
        <>

            <Pressable 
            style={styles.profileButton}
            onPress={onShowNewScreen}
            accessibilityRole='button' 
            accessibilityLabel='statsButton'
            >
            <FontAwesome6 name="bar-chart" size={24} color="black" />
        </Pressable>
     
       </>          
   );
}

const styles = StyleSheet.create({

    profileButton: {
        position: 'absolute',
        top: 20,
        left: 20,
    }

});