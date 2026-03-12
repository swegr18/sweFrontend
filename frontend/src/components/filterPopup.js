import React, { useState } from 'react'; 
import { Text, View, StyleSheet, Pressable } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import FilterSwitch from './filterSwitch';

export default function FilterPopup({ filters, setFilters, resetFilter }) {
    
    const [filterOpen, setFilterOpen] = useState(false);

    
    const toggleFilter = () => {
        if(filterOpen){
            resetFilter();
        }
        setFilterOpen(!filterOpen);
    }

    return (

        <View style={styles.container}> 
          <Pressable
            style={styles.filterButton}
            onPress={toggleFilter}
            accessibilityRole='button'
            accessibilityLabel='FilterButton'
          >
            <AntDesign name="filter" size={24} color="white" />
          </Pressable>
          {filterOpen && (
            <View style={styles.popup}>
                <Text style={styles.title}>Filter</Text>
                <FilterSwitch style={styles.switch} filter={filters} onFilterChange={setFilters}/>
            </View>
          )}
        </View>
    );
} 

const styles = StyleSheet.create({
  container:{
    position: 'absolute',
    top: 10,
    left: 10,
    height: "80",
    width: "40%",
    zIndex: 5,
  },
  popup: {
    backgroundColor: '#313639',
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: "2px",
    borderWidth: 2,
    borderColor: '#ff0042',
    boxShadow: 'inset 0px 0px 20px #E00043',
  },
  filterButton: {
    position: 'absolute',
    top: 10,
    left: 10,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontFamily: 'Exo_700Bold',
    color: 'white',
    textAlign: 'right',
    width: "80%",
  },
  switch:
  {
    marginBottom: 20,
  }
});
