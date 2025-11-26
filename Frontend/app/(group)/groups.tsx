import React, { useState } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { View, TextInput, FlatList, Text, StyleSheet, Alert, TouchableOpacity, Platform, Image } from 'react-native';

const data = [
  { group_id: '1', group_name: 'groupA' },
  { group_id: '2', group_name: 'groupB' },
  { group_id: '3', group_name: 'groupC' },
  { group_id: '4', group_name: 'groupD' },
  { group_id: '5', group_name: 'groupE' },
];

const GroupsSearchTab = () => {
  const backgroundImage = require('../../assets/images/backgroundImage.jpeg');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [isFocused, setIsFocused] = useState(false);

  const handleSearch = (text:string) => {
    setSearchQuery(text);

    const newData = data.filter(item => {
      const itemData = item.group_name ? item.group_name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    
    setFilteredData(newData);
  };

  const createGroup = () => {
    Alert.alert('Custom Button Pressed!');
  };

  interface GroupItem {
    group_id: string; 
    group_name: string;
  }

  const groupItem = ({ item }: { item: GroupItem }) => (
    <TouchableOpacity 
      style={styles.button}
      onPress={() => console.log('Botón presionado:', item.group_name)}
    >
      <View style={styles.listItemContainer}>
        <Text style={{ color: "#ffa052", fontSize: 32, paddingBottom: 3}}>•</Text>
        <View>

        </View>
        <Text style={styles.buttonText}>{item.group_name}</Text>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <Image 
        source={backgroundImage} 
        style={styles.backgroundImage}
        // Usa 'contain' o 'center' si no quieres que se estire
        resizeMode="contain" 
      />

      <View style={styles.searchAddContainer}>
        <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
        <TextInput
          style={[ styles.searchInput, Platform.OS === 'web' && { outlineStyle: 'none' as any } ]}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={handleSearch}
          onFocus={() => setIsFocused(true)} 
          onBlur={() => setIsFocused(false)} 
          underlineColorAndroid="transparent"
        />
        <FontAwesome6 name="magnifying-glass" size={18} color="black" style={styles.searchIcon}/>
        </View>

        <TouchableOpacity style={styles.plusButton} onPress={createGroup}>
          <FontAwesome6 name="plus" size={15} color="black" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredData}
        keyExtractor={item => item.group_id}
        renderItem={ groupItem }
      />

    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute', 
    // La centra respecto al contenedor padre
    top: 0, 
    left: 0, 
    bottom: 0, 
    right: 0,
    // La opacidad la hace menos intrusiva
    opacity: 0.3, 
    // Ajusta el tamaño de la imagen según tus necesidades:
    width: '100%', 
    height: '100%',
  },

  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 0,
    backgroundColor: '#fff',
    position: 'relative',
  },

  searchAddContainer: {
    flexDirection: 'row',
    marginHorizontal: 20,
  },
  searchContainer: {
    flex: 9,
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    marginTop: 5,
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  searchContainerFocused: {
    borderColor: '#b300ffff', 
    borderWidth: 2,
    marginTop: 4,
    marginBottom: 14,
    paddingHorizontal: 4,
  },
  searchInput: {
    height: 40,
    borderRadius: 20,
    paddingHorizontal: 10,
    flex: 1,
  },
  searchIcon: {
    marginRight: 10,
  },

  plusButton: {
    backgroundColor: '#fff',
    padding: 1,
    margin: 5,
    marginBottom: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },

  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
  },
});

export default GroupsSearchTab;