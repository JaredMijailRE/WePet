import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Platform } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface CustomSearchBarProps {
  placeholder?: string; 
  searchQuery: string; 
  handleSearch: (text: string) => void; 
}

const CustomSearchBar = ({ placeholder, searchQuery, handleSearch }: CustomSearchBarProps) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={[styles.searchContainer, isFocused && styles.searchContainerFocused]}>
        <TextInput
            style={[ styles.searchInput, Platform.OS === 'web' && { outlineStyle: 'none' as any } ]}
            placeholder={ placeholder || 'Search...' }
            value={ searchQuery }
            onChangeText={ handleSearch }

            onFocus={() => setIsFocused(true)} 
            onBlur={() => setIsFocused(false)} 
            underlineColorAndroid="transparent"
        />
        <FontAwesome6 name="magnifying-glass" size={18} color="black" style={{ marginRight: 10 }}/>
        </View>
  );
};

const styles = StyleSheet.create({
    searchContainer: {
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
});

export default CustomSearchBar;