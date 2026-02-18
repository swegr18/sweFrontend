import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import StatsButton from './src/statsButton';
import LogonPopup from './src/profile';
import RecordScreen from './src/record';
import StatsScreen from './src/statsScreen';
export default function App() {

  // main = recording screen, stats = stats screen
  const [activeScreen, setActiveScreen] = useState('main');

  // funtions to give to other pages
  const goToDetail = () => setActiveScreen('stats');
  const goBack = () => setActiveScreen('main');


  return (
    <View style={styles.screenWrapper}>
      <View style={styles.container}>

        {activeScreen === 'main' ? (
          <>
            <StatsButton onShowNewScreen={goToDetail} />
            <LogonPopup />
            <RecordScreen />
          </>
        ) : (
          // else:
          <StatsScreen onBack={goBack} />
        )}
      
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

  screenWrapper: {
    flex: 1,
    backgroundColor: '#999',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Making the app look mobile like
  container: {
    width: 360,                
    height: 640,               
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',

  }
});