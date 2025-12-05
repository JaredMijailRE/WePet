import React, { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet, TouchableOpacity, Image, Modal, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import CustomSearchBar from "@/components/ui/searchbar";
import { useGroups } from '@/hooks';

const data = [
  { group_id: '1', group_name: 'groupA' },
  { group_id: '2', group_name: 'groupB' },
  { group_id: '3', group_name: 'groupC' },
  { group_id: '4', group_name: 'groupD' },
  { group_id: '5', group_name: 'groupE' },
];

const GroupsSearchTab = () => {
  const backgroundImage = require('../../assets/images/backgroundImage.jpeg');
  const groupImage = require('../../assets/images/groupIcon.png');

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);
  const [modalVisible, setModalVisible] = useState(false);

  const router = useRouter();

  interface GroupItem {
    group_id: string; 
    group_name: string;
  }

  const handleSearch = (text:string) => {
    setSearchQuery(text);

    const newData = data.filter(item => {
      const itemData = item.group_name ? item.group_name.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    
    setFilteredData(newData);
  };

  const joinGroup = () => {
    setModalVisible(true)
  };

  const groupItem = ({ item }: { item: GroupItem }) => (
    <TouchableOpacity 
      style={styles.button}
      onPress={() => handleGroup()}
    >
      <View style={styles.listItemContainer}>
        <Text style={{ color: "#9c76c2", fontSize: 32, paddingBottom: 3}}>•</Text>
        <View style={styles.groupIconContainer}>
          <Image 
            source={groupImage} 
            style={styles.groupIconImage}
            resizeMode="contain" 
          />
        </View>
        <View>
          <Text style={styles.buttonText}>{item.group_name}</Text>
          <Text style={styles.buttonSubText}>notification</Text>
        </View>
        
      </View>
    </TouchableOpacity>
  )

  const handleJoin = () => {
    setModalVisible(!modalVisible)
    console.log("Make the user a member!!!")
  }

  const handleCreate = () => {
    setModalVisible(!modalVisible)
    router.push("/(create_group)/create_group")
  }

  const handleGroup = () => {
    router.push("/(create_group)/group-config")
  }

  return (
    <View style={styles.container}>
      <Image 
        source={backgroundImage} 
        style={styles.backgroundImage}
        resizeMode="contain" 
      />
      
      <CustomSearchBar
            placeholder="Search..."
            searchQuery={searchQuery}
            handleSearch={handleSearch}
            onAdd={joinGroup}
      />

      <FlatList
        data={filteredData}
        keyExtractor={item => item.group_id}
        renderItem={ groupItem }
        showsVerticalScrollIndicator={false}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <Pressable onPress={() => setModalVisible(false)} style={styles.joinGroupModalContainer}>
          <View style={styles.joinGroupModal}>
            <View style={{flexDirection: "row",borderBottomWidth: 1, borderBottomColor: '#ccc',}}>
              <Text style={styles.joinGroupModalTitle}>Join a Group</Text>
            </View>
            <Text style={{ marginTop: 6 }}>Join a Group using the ID!</Text>
            <TextInput
              // style={[ styles.modalInput, Platform.OS === 'web' && { outlineStyle: 'none' as any } ]}
              style={ styles.modalInput }
              placeholder="Group ID"
              value={searchQuery}
              onChangeText={handleSearch}
              // underlineColorAndroid="transparent"
            />
            <View style={{flexDirection: "row"}}>
              <TouchableOpacity 
              style={styles.modalCreateGroup} 
              onPress={() => handleCreate()}
              >
                <Text style={{textAlign: 'center', color: '#9c76c2'}}>or create a group</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.modalButton} onPress={() => handleJoin()}>
                <Text style={{color: '#fff', fontWeight: 'bold'}}>OK</Text>
              </TouchableOpacity>

            </View>
          </View>
        </Pressable>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    position: 'absolute', 
    top: 0, 
    left: 0, 
    bottom: 0, 
    right: 0,
    opacity: 0.3, 
    width: '100%', 
    height: '100%',
  },

  container: {
    flex: 1,
    paddingTop: 30,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    position: 'relative',
  },

  listItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  groupIconContainer: {
    marginHorizontal: 10,
    borderRadius: 2,
    width: 30,  
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  groupIconImage: {
    top: 0, 
    left: 0, 
    bottom: 0, 
    right: 0,
    opacity: 1, 
    width: '80%',
    height: "80%"
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    flex: 9,
  },
  buttonSubText: {
    color: '#313131ff',
    fontWeight: 'light',
  },

  joinGroupModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#00000020',
  },
  joinGroupModal: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  joinGroupModalTitle: {
    color: '#000',
    fontWeight: 'bold',
    marginRight: 150,
    marginBottom: 6,
  },
  modalInput: {
    marginVertical: 6,
    height: 40,
  },
  modalButton: {
    backgroundColor: "#9c76c2",
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 2,
    marginLeft: 5,
  },
  modalCreateGroup: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 4,
    marginLeft: 5,
  }
});

export default GroupsSearchTab;