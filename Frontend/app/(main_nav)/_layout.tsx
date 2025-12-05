import { Tabs } from 'expo-router'
import { View } from 'react-native'
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return (
        <Tabs 
        screenOptions={{
            tabBarActiveTintColor: '#9c76c2',
            headerShadowVisible: false,
            headerStyle: {backgroundColor: '#fff'},
            headerTitleContainerStyle: {paddingLeft: 8},
            headerTintColor: '#25292e',

            tabBarStyle: {
                backgroundColor: '#f3edf7',
                borderTopWidth: 0, 

                position: 'absolute',
                bottom: 25, 
                marginHorizontal: 20, 
                borderRadius: 30, 
                height: 70, 

                shadowColor: '#000',
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.12,
                shadowRadius: 5.84,
                elevation: 5,
            },
            tabBarItemStyle: {
                marginTop: 7,
            },
            tabBarLabelStyle: {
                marginTop: 2, 
                marginBottom: 5, 
                fontSize: 12,
            },

            tabBarBackground: () => (<View style={{ flex: 1, backgroundColor: 'transparent' }} />),
        }}
        >
            
            <Tabs.Screen 
            name="groups" 
            options={{
                title:'Groups',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'home-sharp' : 'home-outline'} color={color} size={24} />
                )
            }} />

            <Tabs.Screen 
            name="activities" 
            options={{
                title:'Activities',
                tabBarIcon: ({ color, focused }) => (
                    <Ionicons name={focused ? 'information-circle' : 'information-circle-outline'} color={color} size={24} />
                )
            }} />

            <Tabs.Screen
            name="mood"
            options={{
                title: 'Mood',
                tabBarIcon: ({ color, size, focused }) => (
                <Ionicons
                    name={focused ? 'happy' : 'happy-outline'}
                    size={size}
                    color={color}
                />
                ),
            }}
            />
        </Tabs>
    )
}