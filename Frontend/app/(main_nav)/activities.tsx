import { View, StyleSheet, FlatList, Image } from "react-native";
import { useState, useEffect } from "react";

import CustomSearchBar from "@/components/ui/searchbar";
import ActivityCards from "@/components/ui/activitycard";
import ActivityModal from "@/components/ui/activity-modal";
import NewActivityModal from "@/components/ui/newActivity-modal";

import { useActivities } from "@/hooks";

export interface ActivityItem {
  title:string,
  group:string,
  exp: number,
  description: string|undefined,
  end_date: Date,     
  state: string
}

export default function Index() {
  const backgroundImage = require('../../assets/images/backgroundImage.jpeg');

  const { listUserActivities, loading, error } = useActivities();

  const [activityData,            setActivityData]            = useState<ActivityItem[]>([]);
  const [searchQuery,             setSearchQuery]             = useState('');
  const [filteredData,            setFilteredData]            = useState<ActivityItem[]>([]);
  const [selectedActivity,        setSelectedActivity]        = useState<ActivityItem | null>(null);
  const [activityModalVisible,    setActivityModalVisible]    = useState(false);
  const [newActivityModalVisible, setNewActivityModalVisible] = useState(false);

  // Load the activities for the current user
  const loadMyActivities = async () => {
    try {
      const activities = await listUserActivities();
      console.log('activities obtained: ', activities);

      const transformedActivities: ActivityItem[] = activities.map(activity => ({
        title: activity.title,
        group: activity.group_name,
        exp: activity.xp_reward,
        description: activity.description,
        end_date: new Date(activity.end_date),
        state: String(activity.status)
      }));

      setActivityData(transformedActivities)
      setFilteredData(transformedActivities)
    } catch (err) {
      console.error('Error loading groups:', err);
    }
  }

  useEffect(() => {
    loadMyActivities();
  }, []);

  // Handle the search for activities
  const handleSearch = (text:string) => {
    setSearchQuery(text);

    if (text === '') {
      setFilteredData(activityData);
    } else {
      const newData = activityData.filter(item => {
        const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
        const textData = text.toUpperCase();
        return itemData.indexOf(textData) > -1;
      });

      setFilteredData(newData);
    }
  };

  // this part is related to the new activity modal
  const addActivity = () => {
    console.log("en el modal, realizar busqueda de grupos")
    setNewActivityModalVisible(true)
  }

  const createActivity = (formData: any) => {
    console.log("create Activity DTO")
    setNewActivityModalVisible(false)
  }

  // this is for the activity cards
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

  // this is for the activity modal
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
