import { Tabs } from 'expo-router'
import Ionicons from '@expo/vector-icons/Ionicons';

export default function TabLayout() {
    return (
        <Tabs 
        screenOptions={{ 
            tabBarActiveTintColor: '#5c6cd1',
            headerStyle: {backgroundColor: '#fff'},
            headerShadowVisible: false,
            headerTintColor: '#25292e',
            tabBarStyle: {backgroundColor: '#25292e'}
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
        
        </Tabs>
    )
}