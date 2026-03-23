import React, { useState, useEffect } from 'react'; 
import { Text, View, StyleSheet, Pressable, ScrollView } from 'react-native';
import { v4 as uuidv4 } from 'uuid';
import { AntDesign } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import StatCard from './components/statCard.js'
import GraphCard from './components/graphCard.js';
import { LineChart } from "react-native-gifted-charts";
import { Button } from 'react-native-web';
import FilterPopup from './components/filterPopup.js';

export default function StatsScreen({ onBack, accessToken }) {

  const [metrics, setMetrics] = useState(null);
  const [open, setOpen] = useState([]);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState('All');
  const [filteredMetrics, setFilteredMetrics] = useState(null);

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

    const load = async () => {
      const data = await fetchGraphData();

      if(data)
      {
        setMetrics(data);
        setFilteredMetrics(data);
        setOpen(new Array(data.length).fill(false));
        changeOpen(0);
      }
    }

    if(accessToken){
      load();
    }
  }, []);
  
  const filter = () => {
    let filtered = [];
    if(filters == 'All'){
      filtered = metrics;
    }
    else{
      filtered = metrics.filter((metric) => metric.context_mode.replace(/"/g, "") === filters)
    }
    setFilteredMetrics(filtered);
    let newOpen = Array(filtered.length).fill(false);
    if(newOpen.length > 0){
      newOpen[0] = true;
    }
    setOpen(newOpen);
  }

  const formatDatetime = (unformatted) => {
    let split = unformatted.split("T");
    split[0] = formatDate(split[0]);
    split[1] = split[1].slice(0,5);
    return split;
  }

  const formatDate = (unformatted) => {
    let split = unformatted.split("-");
    if(split[2] < 10){
      split[2] = split[2][1]
    }
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    return `${split[2]}-${months[split[1]-1]}`
  }

  const changeOpen = (i) => {
    let newOpen = [...open];
    newOpen[i] = !newOpen[i];
    setOpen(newOpen);
  }

  const getBounds = (arr) => {
    let upper = Math.max(...arr);
    let lower = Math.min(...arr);
    let upperBound = Math.ceil(upper / 10) * 10 + 10;
    let lowerBound = Math.floor(lower / 10) * 10 - 10;
    return [upperBound, lowerBound];
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
        <>
        <FilterPopup filters={filters} setFilters={setFilters} resetFilter={filter}/>
        <ScrollView>
          {metrics !== null ? (
            <>
              {filteredMetrics.length === 0 ? (
                <>
                  <Text style={styles.bigText}>Current filters gave no results</Text>
                </>
              ) : (
                <>
                  {filteredMetrics.map((speech,i) => (
                    <View key={speech.audio_id} style={styles.card}>
                      <View style={styles.dropdownline}>
                        <Pressable accessibilityRole='button' accessibilityLabel='DropdownButton' onPress={() => changeOpen(i)}>
                          <FontAwesome style={styles.dropdown} name={open[i] ? "angle-down" : "angle-right"} size={30} color="white" />
                        </Pressable>
                        <Text style={[styles.text, {width: "80%"}]} numberOfLines={open[i] ? "" : 1}>{speech.name}</Text>
                        <Text style={styles.text}>{formatDatetime(speech.created_at)[0]}</Text>
                      </View>
                      {open[i] && (
                        <>
                          <Text style={[styles.text, {textAlign:'right'}]}>{formatDatetime(speech.created_at)[1]}</Text>

                          <View style={styles.oneline}>
                            <StatCard title={"DURATION (s)"} value={speech.duration} style={{width: "50%"}}/>
                            <StatCard title={"WPM"} value={speech.wpm} style={{width: "50%"}}/>
                          </View>

                          <View style={styles.oneline}>
                            <GraphCard title={"VOLUME (db)"} values={speech.graph_volume} upperBound={-getBounds(speech.graph_volume)[1]} lowerBound={getBounds(speech.graph_volume)[1]} step={10}/>
                            <GraphCard title={"PITCH (Hz)"} values={speech.graph_freq} upperBound={getBounds(speech.graph_freq)[0]} lowerBound={0}/>
                          </View>

                          <StatCard title={"PROP. FILLERS"} value={speech.filler_proportion.toPrecision(3)} style={{width: "100%"}}/>
                          <StatCard title={"TRANSCRIBABILITY"} value={speech.transcribability.toPrecision(5)} style={{width: "100%"}}/>

                          <StatCard title={"CONTEXT MODE"} value={speech.context_mode.replace(/"/g, "")} style={{width: "100%"}}/>
                        </> 
                      )}
                    </View>
              ))}
                </>
              )}
              
            </>
          ) : (
            <Text style={styles.text}>Loading...</Text>
          )}
          
        </ScrollView>
        </>
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
    justifyContent: "space-between",
    paddingRight: 25
  },
  oneline: {
    flexDirection: "row",
    alignSelf: 'center',
    width: "100%",
    justifyContent: 'space-between'
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
  lefttext: {
    fontSize: 14,
    fontFamily: 'Exo_700Bold',
    color: 'white',
    textAlign: 'left'
  },
  righttext: {
    fontSize: 14,
    fontFamily: 'Exo_700Bold',
    color: 'white',
    textAlign: 'right'
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