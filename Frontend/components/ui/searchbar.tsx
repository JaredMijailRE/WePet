import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';

interface CustomSearchBarProps {
  placeholder?: string; 
  searchQuery: string; 
  handleSearch: (text: string) => void; 
  onAdd: () => void;
}

const CustomSearchBar = ({ placeholder, searchQuery, handleSearch, onAdd }: CustomSearchBarProps) => {
    const [isFocused, setIsFocused] = useState(false);

    return (
        <View style={styles.mainContainer}>

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

            <TouchableOpacity style={styles.plusButton} onPress={onAdd}>
                <FontAwesome6 name="plus" size={15} color="black" />
            </TouchableOpacity>

        </View>
  );
};

const styles = StyleSheet.create({
    mainContainer: {
        flexDirection: 'row',
    },

    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#595959',
        borderWidth: 1,
        borderRadius: 20,
        marginTop: 5,
        marginBottom: 15,
        paddingHorizontal: 5,
        flex: 9,
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
});

export default CustomSearchBar;