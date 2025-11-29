import React, { useState } from 'react';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { View, TextInput, FlatList, Text, StyleSheet, Alert, TouchableOpacity, Platform, Image, Pressable } from 'react-native';

import { router } from "expo-router";
export default function CreateGroupPage() {

    const [selectedImage, setSelectedImage] = useState(require("../../assets/images/image_dog.png"));

    return (
        <View style={styles.container}>
            <Text style ={styles.text}>Create a New Group!</Text>
            {/* <Pressable style = {styles.button} onPress = {() => alert('You pressed a button')}>
                <Text style = {styles.buttonLabel}>Label</Text>
            </Pressable> */}
            <View>
                <TextInput style = {styles.testInput} placeholder='Group name' placeholderTextColor={'#000000ff'}></TextInput>
            </View>
            <View style={styles.buttonContainers}>
                <TouchableOpacity style={styles.circleButton}  onPress={() => setSelectedImage(require("../../assets/images/image_dog.png"))}>
                    <Image
                        source={require('../../assets/images/image_dog.png')}
                        style={styles.circleImage}
                    /> 
                </TouchableOpacity>               
                <TouchableOpacity style={styles.circleButton} onPress={() => setSelectedImage(require("../../assets/images/image_cat.png"))}>
                    <Image
                        source={require('../../assets/images/image_cat.png')}
                        style={styles.circleImage}
                    />
                </TouchableOpacity>
                <TouchableOpacity style = {styles.circleButton} onPress={() => setSelectedImage(require("../../assets/images/image_dragon.png"))}>
                    <Image
                        source={require('../../assets/images/image_dragon.png')}
                        style={styles.circleImage}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={styles.circleButton} onPress={() => setSelectedImage(require("../../assets/images/image_duck.png"))}>
                    <Image
                        source={require('../../assets/images/image_duck.png')}
                        style={styles.circleImage}
                    />
                </TouchableOpacity>
            </View>
            <View>
            <Image
                source={selectedImage}
                style={styles.petImage}>

            </Image>
            </View>
            <Text style ={styles.text}>Choose a name for your pet!</Text>
            <View>
                <TextInput style = {styles.testInputBottom} placeholder='Pet Name' placeholderTextColor={'#000000ff'}></TextInput>
            </View>

            
            <View style = {styles.buttonContainer}>
            <Pressable style = {[styles.button, {backgroundColor: '#9c76c2'}]} onPress = {() => {router.push("/(main_nav)/groups");}}>
                <Text style = {styles.buttonLabel}>Exit</Text>
            </Pressable>
            <Pressable style = {[styles.button, {backgroundColor: '#9c76c2'}]} onPress = {() => alert('You pressed a button')}>
                <Text style = {styles.buttonLabel}>Ok</Text>
            </Pressable>
            </View>
            
        </View>
    )
}
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
  container:{
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
    paddingVertical: 2, //Este es el que nos ayuda a centrar verticalmente el placeholder
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
    paddingVertical: 2, //Este es el que nos ayuda a centrar verticalmente el placeholder
    borderBottomColor: '#6d6bf5ff',
    fontSize: 18,
    marginInlineEnd: 20,
    marginBottom: 20,
    borderRadius: 2,
  },
  circleButton: {
    padding: 1,
    borderRadius: 50,
    borderWidth:1,
    borderColor: '#000000ff',
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  circleImage: {
    width: 80,
    height: 80,
    borderRadius:40,
  },
  text: {
    color: '#000000ff',
    fontSize: 20,
    marginBottom: 20
  },
  buttonContainers:{
    width: 320,
    height: 68,
    marginHorizontal: 2,
    gap: 20,
    marginRight:20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    flexDirection: 'row'
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
    marginRight:20,
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