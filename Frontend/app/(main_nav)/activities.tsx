import { View, StyleSheet, FlatList, Image } from "react-native";
import { useState } from "react";
import CustomSearchBar from "@/components/ui/searchbar";
import ActivityCards from "@/components/ui/activitycard";
import ActivityModal from "@/components/ui/activity-modal";
import NewActivityModal from "@/components/ui/newActivity-modal";

const data = [
  { title: "Activity 1", group: "Group 1", exp: 10, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", end_date: "02-12-2025", state: "completed" },
  { title: "Activity 2", group: "Group 2", exp: 10, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", end_date: "11-12-2025", state: "active" },
  { title: "Activity 3", group: "Group 2", exp: 10, description: "description 3", end_date: "03-12-2025", state: "expired" },
  { title: "Activity 4", group: "Group 1", exp: 10, description: "description 4", end_date: "05-12-2025", state: "completed" },
  { title: "Activity 5", group: "Group 1", exp: 10, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", end_date: "02-12-2025", state: "completed" },
  { title: "Activity 6", group: "Group 2", exp: 10, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", end_date: "11-12-2025", state: "active" },
  { title: "Activity 7", group: "Group 2", exp: 10, description: "description 3", end_date: "03-12-2025", state: "expired" },
  { title: "Activity 8", group: "Group 1", exp: 10, description: "description 4", end_date: "05-12-2025", state: "completed" },
  { title: "Activity 9", group: "Group 1", exp: 10, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", end_date: "02-12-2025", state: "completed" },
  { title: "Activity 10", group: "Group 2", exp: 10, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", end_date: "11-12-2025", state: "active" },
  { title: "Activity 11", group: "Group 2", exp: 10, description: "description 3", end_date: "03-12-2025", state: "expired" },
  { title: "Activity 12", group: "Group 1", exp: 10, description: "description 4", end_date: "05-12-2025", state: "completed" },
]

export interface ActivityItem {
  title:string,
  group:string,
  exp: number,
  description: string,
  end_date: string,     
  state: string
}

export default function Index() {
  const backgroundImage = require('../../assets/images/backgroundImage.jpeg');

  const [searchQuery,             setSearchQuery]             = useState('');
  const [filteredData,            setFilteredData]            = useState(data);
  const [selectedActivity,        setSelectedActivity]        = useState<ActivityItem | null>(null);
  const [activityModalVisible,    setActivityModalVisible]    = useState(false);
  const [newActivityModalVisible, setNewActivityModalVisible] = useState(false);

  const handleSearch = (text:string) => {
    setSearchQuery(text);
    const newData = data.filter(item => {
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    
    setFilteredData(newData);
  };

  const addActivity = () => {
    console.log("en el modal, realizar busqueda de grupos")
    setNewActivityModalVisible(true)
  }

  const createActivity = (formData: any) => {
    console.log("create Activity DTO")
    setNewActivityModalVisible(false)
  }

  const activityCard = ({ item }: { item: ActivityItem }) => (
    <ActivityCards
    item={item}
    handlePress={() => handleActivityPress(item)}
    />
  );

  const handleActivityPress = (item: ActivityItem) => {
    setSelectedActivity(item)
    setActivityModalVisible(true)
  }

  const handleUpdateActivity = (item: ActivityItem) => {
    console.log("update the activity!!!")
    setActivityModalVisible(false)
  }

  return (
    <View style={styles.mainContainer}>
      <Image 
        source={backgroundImage} 
        style={styles.backgroundImage}
        resizeMode="contain" 
      />

      <CustomSearchBar
        placeholder="Search an Activity..."
        searchQuery={searchQuery}
        handleSearch={handleSearch}
        onAdd={addActivity}
      />

      <FlatList
        data={filteredData}
        keyExtractor={item => item.title}
        renderItem={ activityCard }
        showsVerticalScrollIndicator={false}
      />

      {activityModalVisible && selectedActivity && (
        <ActivityModal
          activity={selectedActivity} 
          visible={activityModalVisible}
          onClose={() => setActivityModalVisible(false)}
          onUpdate={() => handleUpdateActivity(selectedActivity)} 
        />
      )}

      <NewActivityModal
        visible={newActivityModalVisible}
        onClose={() => setNewActivityModalVisible(false)}
        onSubmit={createActivity}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 30,
    paddingBottom: 100,
    flex: 1,
    backgroundColor:'#fff',
  },
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
})
