import React, { useState } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { View, TextInput, FlatList, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

const data = [
  { group_id: '1', group_name: 'groupA' },
  { group_id: '2', group_name: 'groupB' },
  { group_id: '3', group_name: 'groupC' },
  { group_id: '4', group_name: 'groupD' },
  { group_id: '5', group_name: 'groupE' },
];

const GroupsSearchTab = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const handleSearch = (text:string) => {
    setSearchQuery(text);

    const newData = data.filter(item => {
      const itemData = item.group_name ? item.group_name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    
    setFilteredData(newData);
  };

  const handlePress = () => {
    Alert.alert('Custom Button Pressed!');
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search..."
          value={searchQuery}
          onChangeText={handleSearch}
        />
        <TouchableOpacity style={styles.button} onPress={handlePress}>
          <FontAwesome6 name="plus" size={15} color="black" />
          <Text style={styles.buttonText}></Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredData}
        keyExtractor={item => item.group_id}
        renderItem={({ item }) => <Text style={styles.listItem}>{item.group_name}</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: '#fff'
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginTop: 5,
    marginBottom: 15,
    flex: 9,
  },
  searchContainer: {
    flexDirection: 'row',
  },
  button: {
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
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  listItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default GroupsSearchTab;