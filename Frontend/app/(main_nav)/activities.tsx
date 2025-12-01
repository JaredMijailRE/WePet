import { View, StyleSheet, FlatList, Image } from "react-native";
import { useState } from "react";
import CustomSearchBar from "@/components/ui/searchbar";
import ActivityCards, { getEstadoVisual } from "@/components/ui/activitycard";

const data = [
  { title: "Activity 1", group: "Group 1", exp: 10, description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.", end_date: "some date", state: "completed" },
  { title: "Activity 2", group: "Group 2", exp: 10, description: "description 2", end_date: "some date", state: "inprogress" },
  { title: "Activity 3", group: "Group 2", exp: 10, description: "description 3", end_date: "some date", state: "expired" },
  { title: "Activity 4", group: "Group 1", exp: 10, description: "description 4", end_date: "some date", state: "completed" },
]

interface ActivityItem {
  title:string,
  group:string,
  exp: number,
  description: string,
  end_date: string,     // Esto es un datetime...
  state: string
}

export default function Index() {
  const backgroundImage = require('../../assets/images/backgroundImage.jpeg');

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(data);

  const handleSearch = (text:string) => {
    setSearchQuery(text);
    const newData = data.filter(item => {
      const itemData = item.title ? item.title.toUpperCase() : ''.toUpperCase();
      const textData = text.toUpperCase();
      return itemData.indexOf(textData) > -1;
    });
    
    setFilteredData(newData);
  };

  const activityCard = ({ item }: { item: ActivityItem }) => (
    <ActivityCards
    title={item.title}
    group={item.group}
    exp={item.exp}
    description={item.description}
    end_date={item.end_date}
    state={getEstadoVisual(item.state)}

    handlePress={handleActivityPress}
    />
  );

  const handleActivityPress = () => {
    console.log("Go to activity");
  }

  return (
    <View style={styles.mainContainer}>
      <Image 
        source={backgroundImage} 
        style={styles.backgroundImage}
        resizeMode="contain" 
      />

      <View style={{ marginVertical: 20 }}>
        <CustomSearchBar
          placeholder="Search an Activity..."
          searchQuery={searchQuery}
          handleSearch={handleSearch}
        />
      </View>


      <FlatList
        data={filteredData}
        keyExtractor={item => item.title}
        renderItem={ activityCard }
      />

    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    paddingHorizontal: 30,
    paddingBottom: 30,
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
