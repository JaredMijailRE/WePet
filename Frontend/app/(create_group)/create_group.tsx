import React, { use, useState } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { View, TextInput, FlatList, Text, StyleSheet, Alert, TouchableOpacity, Platform, Image, Pressable } from 'react-native';
import { PetStyler } from '../../components/pet-styler';
import { router } from "expo-router";
import { useGroups } from '@/hooks';
import { createPet } from '@/services/pet';

type PetStyle = 'dog' | 'cat' | 'dragon' | 'duck';

export default function CreateGroupPage() {
    const {createGroup, loading, error} = useGroups();
    const [selectedStyle, setSelectedStyle] = useState<PetStyle>('dog');
    const [name, setGroupName] = useState('');
    const [petName, setPetName] = useState('');

    const petStyles: PetStyle[] = ['dog', 'cat', 'dragon', 'duck'];

    const handleCreateGroup = async () => {
        if (!name.trim() || !petName.trim()) {
            Alert.alert('Error', 'Por favor ingresa el nombre del grupo y de la mascota');
            return;
        }
        const newGroup = await createGroup({ name });
        if (!newGroup || !newGroup.id) {
          Alert.alert('Error', 'No se pudo crear el grupo');
          return;
        }

        try {
          const newPet = await createPet(newGroup.id, petName, selectedStyle);
        } catch (err) {
          console.error('Error creating pet:', err);
          Alert.alert('Advertencia', 'El grupo se creó pero la mascota no pudo ser creada.');
        }
        Alert.alert('Éxito', `Grupo "${name}" creado con mascota ${selectedStyle}`);
        console.log('Éxito en crear la mascota');
        router.push("/(main_nav)/groups");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.text}>Create a New Group!</Text>
            
            <View>
                <TextInput 
                    style={styles.testInput} 
                    placeholder='Group name' 
                    placeholderTextColor={'#000000ff'}
                    value={name}
                    onChangeText={setGroupName}
                />
            </View>

            {/* Pet Style Selection - 4 circular buttons */}
            <View style={styles.buttonContainers}>
                {petStyles.map((petStyle) => (
                    <TouchableOpacity
                        key={petStyle}
                        style={[
                            styles.circleButton,
                            selectedStyle === petStyle && styles.circleButtonSelected,
                        ]}
                        onPress={() => setSelectedStyle(petStyle)}
                    >
                        <PetStyler style={petStyle} size={60} />
                    </TouchableOpacity>
                ))}
            </View>

            {/* Preview of selected pet */}
            <View style={styles.previewContainer}>
                <PetStyler style={selectedStyle} size={100} />
            </View>

            <Text style={styles.text}>Choose a name for your pet!</Text>
            <View>
                <TextInput 
                    style={styles.testInputBottom} 
                    placeholder='Pet Name' 
                    placeholderTextColor={'#000000ff'}
                    value={petName}
                    onChangeText={setPetName}
                />
            </View>

            <View style={styles.buttonContainer}>
                <Pressable 
                    style={[styles.button, { backgroundColor: '#9c76c2' }]} 
                    onPress={() => router.push("/(main_nav)/groups")}
                >
                    <Text style={styles.buttonLabel}>Exit</Text>
                </Pressable>
                <Pressable 
                    style={[styles.button, { backgroundColor: '#9c76c2' }]} 
                    onPress={handleCreateGroup}
                >
                    <Text style={styles.buttonLabel}>Ok</Text>
                </Pressable>
            </View>
        </View>
    )
}

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
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  testInput: {
    width: '100%',
    borderWidth: 0,
    color: '#272727ff',
    borderBottomWidth: 3,
    paddingVertical: 2,
    borderBottomColor: '#6d6bf5ff',
    fontSize: 18,
    marginInlineEnd: 20,
    marginBottom: 50,
    borderRadius: 2,
  },
  testInputBottom: {
    width: '100%',
    borderWidth: 0,
    color: '#272727ff',
    borderBottomWidth: 3,
    paddingVertical: 2,
    borderBottomColor: '#6d6bf5ff',
    fontSize: 18,
    marginInlineEnd: 20,
    marginBottom: 20,
    borderRadius: 2,
  },
  circleButton: {
    padding: 8,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9f9f9',
  },
  circleButtonSelected: {
    borderColor: '#9c76c2',
    borderWidth: 3,
    backgroundColor: '#f3edf7',
  },
  text: {
    color: '#000000ff',
    fontSize: 20,
    marginBottom: 20
  },
  buttonContainers: {
    width: '90%',
    height: 90,
    marginHorizontal: 2,
    gap: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexDirection: 'row'
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
    height: 120,
    justifyContent: 'center',
  },
  footerContainer: {
    flex: 1/3,
    alignItems: 'center'
  },
  button: {
    borderRadius: 10,
    width: 80,
    height: 62,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  buttonLabel: {
    color: '#fff',
    fontSize: 20,
  },
  buttonContainer: {
    width: 320,
    gap: 10,
    height: 68,
    marginHorizontal: 2,
    marginRight: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  petImage: {
    alignItems: 'center',
    marginBottom: 30,
    marginTop: 20,
    width: 100,
    height: 100
  }
});
