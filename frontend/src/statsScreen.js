import React, { useState, useEffect } from 'react'; 
import { Text, View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { AntDesign } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import StatCard from './components/statCard.js'
import GraphCard from './components/graphCard.js';
import { LineChart } from "react-native-gifted-charts";

export default function StatsScreen({ onBack, accessToken }) {

  const [metrics, setMetrics] = useState(null);
  const [open, setOpen] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchGraphData = async () => {
      const response = await fetch("http://143.110.169.239:8000/api/v1/auth/me", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      })
      let resp = await response.json();
      let userid = resp.id;
    
      const response2 = await fetch(`http://143.110.169.239:8000/api/v1/graphs?user_id=${userid}`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
      })

      resp = await response2.json();
      if(!response2.ok){
        console.log(resp.detail);
        return null
      }
      else{
        return resp;
      }
    }

    //setMetrics(fetchGraphData()); can't use this for testing until the sending name and userid to the backend is working
    
    let mockMetrics = [
      {
        "audio_id": uuidv4(),
        "created_at": "1/1/26 13:30:04",
        "graph_volume": [-54.1,-53.7,-30.1,-60.2,-53.8,-54.9],
        "graph_freq": [20.1,30.4,20.2,29.5,15.6,31.8,31.8],
      },
      {
        "audio_id": uuidv4(),
        "created_at": "1/1/26 14:20:45",
        "graph_volume": [-31.1,-32.7,-30.1,-40.2,-35.8,-40.9],
        "graph_freq": [51.1,40.4,30.2,29.5,35.6,41.8,46.8],
      },
    ]
    setOpen(new Array(mockMetrics.length).fill(false));
    changeOpen(0);
    setMetrics(mockMetrics);
  }, []);

  const changeOpen = (i) => {
    let newOpen = [...open];
    newOpen[i] = !newOpen[i];
    setOpen(newOpen);
  }
    
  return (
    <View style={styles.statsScreen}>
      <Text style={styles.title}>Stats</Text>
      <Pressable 
        style={styles.backButton}
        onPress={onBack}
        accessibilityRole='button' 
        accessibilityLabel='statsBackButton'
      >
        <AntDesign name="close" size={24} color="red" />
      </Pressable>
      {accessToken !== null ? (
        <ScrollView>
          {metrics?.map((speech,i) => (
            <View key={speech.audio_id} style={styles.card}>
              <View style={styles.dropdownline}>
                <Pressable onPress={() => changeOpen(i)}>
                  <FontAwesome style={styles.dropdown} name={open[i] ? "angle-down" : "angle-right"} size={30} color="white" />
                </Pressable>
                <Text style={styles.text}>{speech.audio_id}</Text>
              </View>
              {open[i] && (
                <>
                  <Text style={styles.text}>{speech.created_at}</Text>
                  
                  <View style={styles.oneline}>
                    <GraphCard title={"VOLUME (db)"} values={speech.graph_volume} upperBound={100} lowerBound={-100}/>
                    <GraphCard title={"PITCH (Hz)"} values={speech.graph_freq} upperBound={100} lowerBound={0}/>
                  </View>
                </> 
              )}
            </View>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.bigText}>Sign in or create an account to view full stats</Text>
      )}
    </View>
  );
} 

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    marginBottom: 10,
    fontFamily: 'Exo_700Bold',
    color: 'white',
    alignSelf: 'center'
  },
  backButton: {
    position: 'absolute',
    top: 20,
    right: 20,
  },
  statsScreen: {
    width: "100%",
    height: "100%",
    padding: 15
  },
  bigText: {
    fontSize: 20,
    fontFamily: 'Exo_700Bold',
    color: 'white',
    alignSelf: 'center'
  },
  dropdownline: {
    flexDirection: "row",
    alignSelf: 'center',
    marginTop: 7,
    width: "100%",
    marginLeft: 60,
  },
  oneline: {
    flexDirection: "row",
    alignSelf: 'center',
    width: "100%",
  },
  dropdown: {
    position: 'absolute',
    left: -30,
    top:-5
  },
  text: {
    fontSize: 14,
    fontFamily: 'Exo_700Bold',
    color: 'white',
  },
  card: {
    backgroundColor: '#313639',
    padding: 15,
    paddingBottom: 20,
    borderRadius: 12,
    marginBottom: 25,
    borderColor: 'red',
    borderWidth: 3,
    boxShadow: 'inset 0px 0px 50px #E00043',
    fontFamily: "Exo_700Bold"
  }
});